import { createClient } from '@/lib/supabase/server';

// Fire-and-forget daily AI usage counter (feeds the admin dashboard card).
// Never throws — tracking must never break a chat reply.
export function trackAIUsage(endpoint: 'chat' | 'nutrition') {
  try {
    const supabase = createClient();
    // Don't await: don't delay the user's reply for analytics.
    (supabase.rpc('bump_ai_usage', { p_endpoint: endpoint }) as unknown as Promise<unknown>).catch(
      () => {}
    );
  } catch {
    // Migration not run yet or Supabase unreachable — ignore silently.
  }
}

// True only when Groq says the free quota is exhausted.
export function isQuotaError(e: any): boolean {
  const status = e?.status ?? e?.response?.status;
  if (status === 429) return true;
  const msg = String(e?.message || '').toLowerCase();
  return msg.includes('rate limit') || msg.includes('quota') || msg.includes('429');
}
