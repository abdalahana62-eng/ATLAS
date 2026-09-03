import { NextRequest } from 'next/server';
import { systemCoachPrompt } from '@/lib/ai/prompts';
import { createStreamingChatCompletion, type ChatMessage } from '@/lib/ai/openai';

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
    const { messages, locale } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'Messages array is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const systemPrompt = systemCoachPrompt;

    const chatMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content as string,
      })),
    ];

    const stream = await createStreamingChatCompletion(chatMessages, {
      temperature: 0.8,
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
