import OpenAI from 'openai';

let openaiInstance: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY || 'ollama';
    const baseURL = process.env.OPENAI_BASE_URL || 'http://localhost:11434/v1';

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
