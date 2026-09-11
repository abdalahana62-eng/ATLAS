import { NextRequest } from 'next/server';
import { createChatCompletion } from '@/lib/ai/openai';
import { buildKnowledgeContext } from '@/lib/knowledgeSearch';
import { buildDishContext } from '@/lib/data/dishNutrition';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { message, stats, targetMacros, country } = await req.json();
    if (!message) return Response.json({ error: 'Missing message' }, { status: 400 });

    const isAr = /[\u0600-\u06FF]/.test(message);
    const kb = buildKnowledgeContext(message, isAr ? 'ar' : 'en');
    const dishes = buildDishContext(message, isAr ? 'ar' : 'en');
    const sys = `You are ATLAS nutrition assistant for ${country}. User stats: ${JSON.stringify(stats)} targetMacros: ${JSON.stringify(targetMacros)}.
Answer in the user's language (Arabic if message is Arabic).
STRICT RULES (no exceptions):
1. Use ONLY the verified per-100g values below to compute grams. NEVER invent calorie/macro numbers.
2. If the food is NOT in the verified list, say "القيمة دي تقديرية من مصادر عامة" and give a range, never a fake exact number.
3. Always show the math: grams = needed ÷ per-100g value × 100.
4. Realistic Egyptian/Saudi dishes, quick prep, what to avoid, exact grams. Concise and friendly.${kb}${dishes}`;

    const completion = await createChatCompletion(
      [{ role: 'system', content: sys }, { role: 'user', content: message }],
      { temperature: 0.2, maxTokens: 700, model: 'llama-3.3-70b-versatile' }
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
