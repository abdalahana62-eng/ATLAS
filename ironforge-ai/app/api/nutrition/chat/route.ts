import { NextRequest } from 'next/server';
import { createChatCompletion } from '@/lib/ai/openai';
import { trackAIUsage, isQuotaError } from '@/lib/ai/usage';
import { requireAI } from '@/lib/api/guard';
import { aiRateLimited } from '@/lib/security/rate-limit';
import { buildKnowledgeContext } from '@/lib/knowledgeSearch';
import { buildDishContext } from '@/lib/data/dishNutrition';

export const runtime = 'nodejs';

function quotaUpsell(isAr: boolean): { answer: string; upgrade: boolean } {
  const plansPath = isAr ? '/pricing' : '/en/pricing';
  return {
    upgrade: true,
    answer: isAr
      ? `## خلصت رسائل النهاردة المجانية يا بطل 😅\n\n- رقي اشتراكك عشان تسأل براحتك بدون حدود يومية\n\n[شوف خطط الاشتراك](${plansPath})`
      : `## Today's free replies are done 😅\n\n- Upgrade your subscription to ask freely with no daily limits\n\n[See subscription plans](${plansPath})`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const burst = await aiRateLimited(req, 'nutrition-chat', 20);
    if (burst) return burst;
    const gate = await requireAI(req);
    if (gate instanceof Response) return gate;
    const { message, stats, targetMacros, country, logged } = await req.json();
    if (typeof message !== 'string' || !message.trim() || message.length > 2000) {
      return Response.json({ error: 'Missing message' }, { status: 400 });
    }
    const safeMessage = message.trim().slice(0, 2000);
    const safeCountry = typeof country === 'string' ? country.slice(0, 64) : 'EG';

    const isAr = /[\u0600-\u06FF]/.test(safeMessage);
    const kb = buildKnowledgeContext(safeMessage, isAr ? 'ar' : 'en');
    const dishes = buildDishContext(safeMessage, isAr ? 'ar' : 'en');
    // Full-plan request? (e.g. "عاوز اكل 2000 سعرة") → long structured answer, no word cap
    const q = safeMessage.toLowerCase();
    const targetKcalMatch = safeMessage.match(/(\d{3,4})\s*(سعر|سعره|كالوري|kcal|cal)/);
    const wantsPlan = /اكل ايه|اكل إيه|نظام|وجبات|plan|meal plan|يوم كامل|فطار وغدا|جدول/.test(safeMessage) || !!targetKcalMatch;
    const planKcal = targetKcalMatch ? parseInt(targetKcalMatch[1], 10) : null;
    const remaining = logged && targetMacros ? {
      calories: Math.max(0, targetMacros.calories - (logged.calories || 0)),
      protein: Math.max(0, targetMacros.protein - (logged.protein || 0)),
      carbs: Math.max(0, targetMacros.carbs - (logged.carbs || 0)),
      fats: Math.max(0, targetMacros.fats - (logged.fats || 0)),
    } : null;
    const sys = `You are ATLAS expert nutritionist for ${safeCountry} — you talk like a friendly human coach to a BEGINNER, not like a food table. User stats: ${JSON.stringify(stats ?? {}).slice(0, 800)} dailyTarget: ${JSON.stringify(targetMacros ?? {}).slice(0, 500)} remainingToday: ${JSON.stringify(remaining ?? {}).slice(0, 500)}.
Answer in the user's language (Arabic if message is Arabic). Arabic = simple Egyptian-friendly words (عشان، كده، بص)، short sentences, one idea per line.

=== HUMAN ANSWER PROTOCOL (mandatory) ===
- If the food is in the verified list below: answer DIRECTLY with exact grams computed from remainingToday. NEVER ask generic questions for known foods.
- Ask questions ONLY when truly needed (max 2, food-specific, e.g. koshari → "بيتي ولا من بره؟"). Never generic.
- FORMAT (strict, beginner-readable markdown):
  ## 🎯 الكمية على طول
  سطر واحد: **X جم [الأكل]** (= Y سعرة | بروتين .. | كارب .. | دهون ..) + مثال بسيط (معلقة/كوب/رغيف)
  ## ✅ تعمل ايه
  - 2-3 نقاط قصيرة (تعمل ايه + تتجنب ايه بالجرامات)
  ## 📚 المصدر
  سطر واحد (قاعدة ATLAS / WHO)
- Max 120 words unless full plan requested. No long paragraphs. **bold** only on key numbers.
- End EVERY reply with 2-3 tappable quick replies, each on its OWN line starting with ">> " (e.g. ">> بيتي" / ">> من بره"). Specific to the question — never generic.
STRICT RULES:
1. Use ONLY the verified per-100g values below. NEVER invent numbers. Unknown food → "تقديري من مصادر عامة" + range.
2. Grams from remainingToday first, dailyTarget second.
${wantsPlan
  ? `3. FULL-DAY PLAN MODE: the user wants a complete eating plan${planKcal ? ` of ${planKcal} kcal` : ''}. Give 4-5 meals (فطار/غدا/عشا/2 سناك) with EXACT grams each computed from verified values, Egyptian/Saudi dishes, totals summing to target ±5%. Structure per meal: ## وجبة + grams in **bold** + (kcal|P/C/F) on one line. Keep each meal 2 lines max. End with daily totals + 📚 المصادر + 2 quick replies.`
  : '3. Max 120 words unless user asks for details.'}${kb}${dishes}`;

    let completion;
    try {
      completion = await createChatCompletion(
        [{ role: 'system', content: sys }, { role: 'user', content: safeMessage }],
        { temperature: 0.2, maxTokens: wantsPlan ? 1500 : 700, model: 'openai/gpt-oss-120b' }
      );
    } catch (err: any) {
      if (isQuotaError(err)) {
        console.warn('[ATLAS Nutrition] quota exhausted, sending upsell');
        return Response.json(quotaUpsell(isAr));
      }
      throw err;
    }
    trackAIUsage('nutrition');
    const answer = completion.choices[0]?.message?.content?.trim() ?? '';
    if (!answer) {
      console.error('Empty answer from model', { model: process.env.OPENAI_MODEL });
      return Response.json({ answer: 'عذراً، حاول مرة أخرى بصياغة مختلفة. مثال: عندي بيض ولبنة، كم جرام آكل؟' });
    }
    return Response.json({ answer, v: 'plan-mode-1' });
  } catch (e: any) {
    console.error('[nutrition/chat] failed:', e?.message || e);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
