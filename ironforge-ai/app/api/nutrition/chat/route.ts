import { NextRequest } from 'next/server';
import { createChatCompletion } from '@/lib/ai/openai';
import { buildKnowledgeContext } from '@/lib/knowledgeSearch';
import { buildDishContext } from '@/lib/data/dishNutrition';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { message, stats, targetMacros, country, logged } = await req.json();
    if (!message) return Response.json({ error: 'Missing message' }, { status: 400 });

    const isAr = /[\u0600-\u06FF]/.test(message);
    const kb = buildKnowledgeContext(message, isAr ? 'ar' : 'en');
    const dishes = buildDishContext(message, isAr ? 'ar' : 'en');
    const remaining = logged && targetMacros ? {
      calories: Math.max(0, targetMacros.calories - (logged.calories || 0)),
      protein: Math.max(0, targetMacros.protein - (logged.protein || 0)),
      carbs: Math.max(0, targetMacros.carbs - (logged.carbs || 0)),
      fats: Math.max(0, targetMacros.fats - (logged.fats || 0)),
    } : null;
    const sys = `You are ATLAS expert nutritionist for ${country}. User stats: ${JSON.stringify(stats)} dailyTarget: ${JSON.stringify(targetMacros)} remainingToday: ${JSON.stringify(remaining)}.
Answer in the user's language (Arabic if message is Arabic).

=== ANSWER PROTOCOL ===
- If the food is in the verified list below: answer DIRECTLY with exact grams computed from remainingToday. NEVER ask generic questions for known foods.
- Ask questions ONLY when truly needed (max 2, food-specific, e.g. koshari → "بيتي ولا من بره؟" because restaurant adds oil; never generic "نوعها/صلصة/أساسية؟").
- Structure (short, no fluff):
  🎯 الكمية: X جم [الأكل] (= Y سعرة | P.. C.. F..)
  🧮 الحسبة: سطر واحد
  ⛔ تجنب: (محدد بالجرامات)
  ✅ لو حطيت خلاص: (تعويض باقي اليوم)
- End EVERY reply with 2-3 tappable quick replies, each on its OWN line starting with ">> " (e.g. ">> بيتي" / ">> من بره"). Make them specific to the question — never generic. If no question needed, quick replies suggest next actions (e.g. ">> احسبلي وجبة كاملة").
STRICT RULES:
1. Use ONLY the verified per-100g values below. NEVER invent numbers. Unknown food → "تقديري من مصادر عامة" + range.
2. Grams from remainingToday first, dailyTarget second.
3. Max 120 words unless user asks for details.${kb}${dishes}`;

    const completion = await createChatCompletion(
      [{ role: 'system', content: sys }, { role: 'user', content: message }],
      { temperature: 0.2, maxTokens: 700, model: 'openai/gpt-oss-120b' }
    );
    const answer = completion.choices[0]?.message?.content?.trim() ?? '';
    if (!answer) {
      console.error('Empty answer from model', { model: process.env.OPENAI_MODEL, message });
      return Response.json({ answer: 'عذراً، حاول مرة أخرى بصياغة مختلفة. مثال: عندي بيض ولبنة، كم جرام آكل؟' });
    }
    return Response.json({ answer });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
