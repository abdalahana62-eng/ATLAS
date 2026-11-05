import { createClient } from '@supabase/supabase-js';

// SERVER-ONLY. Uses the service_role key (bypasses RLS).
// NEVER import this from client components — it must stay in route handlers.
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('[supabase] service client missing env (hasUrl=%s hasKey=%s)', !!url, !!key);
    throw new Error(
      'Server missing SUPABASE_SERVICE_ROLE_KEY (or URL). Add it in Vercel → Settings → Environment Variables.'
    );
  }
  // Safe diagnostic: log only the KEY KIND (never any key material) so a wrong
  // key type (publishable/legacy pasted by mistake) is visible in Vercel Logs.
  const kind = key.startsWith('sb_secret_')
    ? 'sb_secret'
    : key.startsWith('sb_publishable_')
      ? 'publishable-WRONG'
      : key.startsWith('eyJ')
        ? 'legacy-jwt'
        : 'unknown';
  if (kind !== 'sb_secret') {
    console.error('[supabase] WRONG service key kind: %s (expected sb_secret_ from Supabase → API Keys → Secret)', kind);
  }
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
