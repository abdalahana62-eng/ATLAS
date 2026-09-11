import { NextRequest } from 'next/server';
import { systemCoachPrompt } from '@/lib/ai/prompts';
import { buildKnowledgeContext } from '@/lib/knowledgeSearch';
import { buildDishContext } from '@/lib/data/dishNutrition';
import { createStreamingChatCompletion, type ChatMessage } from '@/lib/ai/openai';

const EXPERT_PROTOCOL = `
=== EXPERT DIAGNOSTIC PROTOCOL — human-first version (follow strictly) ===
You are a senior coach doing a friendly 1-on-1 consultation with a BEGINNER. Talk like a human, not a textbook.
1. If the user asks for a PLAN/PROGRAM/DIET and you lack key facts (goal, weight, days, equipment), ask up to 3 SHORT specific questions first — numbered, one line each, in simple words (e.g. "1. هدفك تزيد عضل ولا تخس؟"). Never re-ask what is in USER PROFILE.
2. Key facts: goal • weight/height • training days + place (gym/home) • injuries • sleep.
3. Once you have enough info (or user says "just answer / جاوب على طول"), give the tailored solution using the BEGINNER-FIRST TEMPLATE from the system prompt (خلاصة + خطوات مرقمة + غلطة + مصادر + سؤال واحد).
4. Casual questions (what is creatine? how to do bench?) → answer directly in max 120 words with one simple example from Egyptian life + max 1 follow-up.
5. Always end plan answers with: ✅ تعمل ايه الأسبوع ده (3 خطوات) + 📏 تقيس ايه + 📚 المصادر.
6. FORMATTING IS MANDATORY: markdown headings/bullets/numbered steps, blank line between sections, **bold** only on key numbers, max 4 emojis.
`;

export const runtime = 'nodejs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    // تحقق سريع من وجود مفتاح Groq السحابي قبل المحاولة
    if (!process.env.OPENAI_API_KEY) {
      console.error('Chat API: Missing OPENAI_API_KEY');
      return Response.json(
        { error: 'Server missing OPENAI_API_KEY (Groq). Configure it in Vercel → Settings → Environment Variables.' },
        { status: 500, headers: corsHeaders }
      );
    }
    const { messages, locale, profile } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'Messages array is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const lastUser = [...messages].reverse().find((m: any) => m.role === 'user')?.content || '';
    const kb = buildKnowledgeContext(String(lastUser), locale || 'ar');
    const dishes = buildDishContext(String(lastUser), locale || 'ar');
    const profileCtx = profile
      ? `\n\n=== USER PROFILE (known facts — never re-ask these) ===\n${JSON.stringify(profile).slice(0, 1500)}\n`
      : '';
    const systemPrompt = systemCoachPrompt + EXPERT_PROTOCOL + profileCtx + kb + dishes;

    const chatMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content as string,
      })),
    ];

    const stream = await createStreamingChatCompletion(chatMessages, {
      temperature: 0.5,
      maxTokens: 2000,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content ?? '';
          if (delta) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: error?.message ?? 'Failed to process chat request' },
      { status: 500, headers: corsHeaders }
    );
  }
}
