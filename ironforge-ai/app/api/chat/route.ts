import { NextRequest } from 'next/server';
import { systemCoachPrompt } from '@/lib/ai/prompts';
import { buildKnowledgeContext } from '@/lib/knowledgeSearch';
import { buildDishContext } from '@/lib/data/dishNutrition';
import { createStreamingChatCompletion, type ChatMessage } from '@/lib/ai/openai';
import { trackAIUsage, isQuotaError } from '@/lib/ai/usage';

// Friendly upsell shown when the free Groq quota runs out for the day.
// Keep it human + beginner-simple, and link to the real plans page.
function quotaUpsell(locale: string): string {
  const plansPath = locale === 'en' ? '/en/pricing' : '/pricing';
  if (locale === 'en') {
    return `## Oops — today's free replies are done 😅

- Your coach needs a quick rest, but your training doesn't stop
- **Upgrade your subscription** for longer, unlimited daily chats

[See subscription plans](${plansPath})`;
  }
  return `## خلصت رسائل النهاردة المجانية يا بطل 😅

- المدرب محتاج يريّح شوية، لكن تمرينك ميقفش
- **رقي اشتراكك** عشان محادثة أطول بدون حدود يومية

[شوف خطط الاشتراك](${plansPath})`;
}

function sseResponse(fullText: string) {
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: fullText })}\n\n`));
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
}

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

    let stream;
    try {
      stream = await createStreamingChatCompletion(chatMessages, {
        temperature: 0.5,
        maxTokens: 2000,
      });
    } catch (e: any) {
      // Free Groq quota exhausted on ALL fallback models → upsell, don't crash.
      if (isQuotaError(e)) {
        console.warn('[ATLAS Chat] quota exhausted, sending upsell');
        return sseResponse(quotaUpsell(locale || 'ar'));
      }
      throw e;
    }
    trackAIUsage('chat');

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
