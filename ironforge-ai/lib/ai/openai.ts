import OpenAI from 'openai';

let openaiInstance: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY;
    // السحابي الافتراضي هو Groq، وليس ollama المحلي
    const baseURL = process.env.OPENAI_BASE_URL || 'https://api.groq.com/openai/v1';

    if (!apiKey) {
      throw new Error(
        'Missing OPENAI_API_KEY env. Set it on Vercel Dashboard → Settings → Environment Variables (Groq API Key). Locally set it in ironforge-ai/.env.local'
      );
    }

    openaiInstance = new OpenAI({
      apiKey,
      baseURL,
    });
  }

  return openaiInstance;
}

// أقوى موديل شغال فعلياً على نفس مفتاح Groq (تم فحص /models بتاريخ 2026):
// - openai/gpt-oss-120b = الأقوى (117B، reasoning، عربي 81%) ← الافتراضي
// - openai/gpt-oss-20b = احتياطي سريع | qwen/qwen3.8-27b = احتياطي أسلوب مصري بشري
// ملاحظة: موديلات llama القديمة (llama-3.1-8b-instant و llama-3.3-70b-versatile) اتوقفت
// من Groq وترجع "does not exist" — لا تستخدمها.
export const MODEL = process.env.OPENAI_MODEL || 'openai/gpt-oss-120b';

export const FALLBACK_MODELS = ['openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];

function isReasoningModel(model: string): boolean {
  return model.includes('gpt-oss');
}

function baseParams(
  model: string,
  options?: { temperature?: number; maxTokens?: number }
): Record<string, unknown> {
  const params: Record<string, unknown> = {
    model,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 2000,
  };
  // موديلات gpt-oss تخصص جزء من الـ tokens للتفكير الداخلي (reasoning) —
  // بدون reasoning_effort منخفض قد ترجع content فاضي. low = أسرع وأنسب للشات.
  if (isReasoningModel(model)) {
    params.reasoning_effort = 'low';
  }
  return params;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function createChatCompletion(
  messages: ChatMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
    responseFormat?: { type: 'json_object' };
    model?: string;
  }
) {
  const openai = getOpenAIClient();
  const candidates = [options?.model ?? MODEL, ...FALLBACK_MODELS.filter((m) => m !== (options?.model ?? MODEL))];
  let lastError: unknown = null;

  for (const model of candidates) {
    try {
      return await openai.chat.completions.create({
        ...(baseParams(model, options) as any),
        messages,
        response_format: options?.responseFormat,
      });
    } catch (e: any) {
      lastError = e;
      // جرّب الموديل الاحتياطي فقط لو الموديل الحالي ميت أو مضغوط (404/400/429/5xx)
      const status = e?.status ?? e?.response?.status;
      if (status !== 404 && status !== 400 && status !== 429 && status !== 500 && status !== 503) throw e;
      console.warn(`[ATLAS AI] model ${model} failed (${status}), trying fallback...`);
    }
  }
  throw lastError;
}

export async function createStreamingChatCompletion(
  messages: ChatMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  }
) {
  const openai = getOpenAIClient();
  const candidates = [options?.model ?? MODEL, ...FALLBACK_MODELS.filter((m) => m !== (options?.model ?? MODEL))];
  let lastError: unknown = null;

  for (const model of candidates) {
    try {
      // اختبار سريع: لو الموديل ميت، Groq يرمي 404 فوراً قبل الستريم
      const stream = await (openai.chat.completions.create as any)(
        {
          ...(baseParams(model, options) as any),
          messages,
          stream: true,
        },
        { timeout: 30000 }
      );
      return stream as AsyncIterable<any>;
    } catch (e: any) {
      lastError = e;
      const status = e?.status ?? e?.response?.status;
      if (status !== 404 && status !== 400 && status !== 429 && status !== 500 && status !== 503) throw e;
      console.warn(`[ATLAS AI] stream model ${model} failed (${status}), trying fallback...`);
    }
  }
  throw lastError;
}

export function extractJSONFromResponse(content: string): any {
  const jsonMatch = content.match(/\{[\s\S]*\}/) || content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    try {
      return JSON.parse(content.trim());
    } catch {
      throw new Error('Failed to parse JSON from response');
    }
  }
  return JSON.parse(jsonMatch[0]);
}
