import { NextRequest } from 'next/server';
import { createChatCompletion } from '@/lib/ai/openai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { message, stats, targetMacros, country } = await req.json();
    if (!message) return Response.json({ error: 'Missing message' }, { status: 400 });

    const sys = `You are ATLAS nutrition assistant for ${country}. User stats: ${JSON.stringify(stats)} targetMacros: ${JSON.stringify(targetMacros)}. 
Answer in the user's language (Arabic if message is Arabic). 
You MUST ground your answer in realistic Egyptian/Saudi dishes. 
Tell: how many grams to eat, how to prepare quickly, what to avoid, and remaining calories. Be concise, friendly, and give exact grams.`;

    const completion = await createChatCompletion(
      [{ role: 'system', content: sys }, { role: 'user', content: message }],
      { temperature: 0.6, maxTokens: 600 }
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
