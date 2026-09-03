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

export const MODEL = process.env.OPENAI_MODEL || 'openai/gpt-oss-20b';

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
  const model = options?.model ?? MODEL;

  return openai.chat.completions.create({
    model,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens,
    response_format: options?.responseFormat,
  });
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
  const model = options?.model ?? MODEL;

  return openai.chat.completions.create({
    model,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens,
    stream: true,
  });
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
