import { NextRequest } from 'next/server';
import { systemCoachPrompt } from '@/lib/ai/prompts';
import { buildKnowledgeContext } from '@/lib/knowledgeSearch';
import { buildDishContext } from '@/lib/data/dishNutrition';
import { createStreamingChatCompletion, type ChatMessage } from '@/lib/ai/openai';

const EXPERT_PROTOCOL = `
=== EXPERT DIAGNOSTIC PROTOCOL (follow strictly) ===
You are a senior coach doing a 1-on-1 consultation, NOT a generic answer machine.
1. If the user asks for a PLAN, PROGRAM, DIET, or FIX for their situation AND you lack key facts (goal, stats, equipment, injuries, diet, sleep), DO NOT give the final answer yet. Ask up to 3 short, specific questions first (numbered, one line each).
2. Key facts checklist: goal (bulk/cut/strength) • age/gender/height/weight • training days + equipment • injuries • current diet • sleep.
3. Use the USER PROFILE below if present — never re-ask what you already know.
4. Once you have enough info (or user says "just answer"), give a precise tailored solution with exact numbers grounded in the verified data below.
5. Casual/general questions (what is creatine? how to do bench?) → answer directly with one follow-up question max.
6. Always end plan answers with: what to do this week + what to measure + when to report back.
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
