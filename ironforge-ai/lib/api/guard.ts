import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { TRIAL_DAYS } from '@/lib/subscription';

export const TRIAL_DAILY_AI_CAP = 30;
export const SUB_DAILY_AI_CAP = 300;

// Session email from the caller's Supabase cookies OR Authorization Bearer token.
// Bearer is required for the Capacitor APK (cookies are per-origin localhost and never reach atlasfit.pro).
export async function getSessionEmail(req?: Request): Promise<string | null> {
  // 1) Authorization: Bearer <supabase JWT> — used by the APK via apiFetch
  if (req) {
    try {
      const auth = req.headers.get('authorization') || req.headers.get('Authorization');
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const token = auth.slice(7).trim();
        if (token.length > 20) {
          const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          if (url && anon) {
            const { createClient: createJsClient } = await import('@supabase/supabase-js');
            // Validate the JWT directly with Supabase
            const tmp = createJsClient(url, anon);
            const { data } = await tmp.auth.getUser(token);
            if (data?.user?.email) return data.user.email.toLowerCase().trim();
            // Fallback: client with Authorization header set
            const tmp2 = createJsClient(url, anon, { global: { headers: { Authorization: `Bearer ${token}` } } });
            const { data: d2 } = await tmp2.auth.getUser();
            if (d2?.user?.email) return d2.user.email.toLowerCase().trim();
          }
        }
      }
    } catch {}
  }
  // 2) Cookie-based session (web / same-origin)
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    return data.user?.email?.toLowerCase().trim() || null;
  } catch {
    return null;
  }
}

async function hasActiveSubscription(svc: any, email: string): Promise<boolean> {
  try {
    const { data } = await svc
      .from('subscriptions')
      .select('expires_at,status')
      .eq('email', email)
      .maybeSingle();
    return !!(
      data &&
      data.status === 'active' &&
      new Date(data.expires_at).getTime() > Date.now()
    );
  } catch {
    return false;
  }
}

// Returns the active trial row, creating it (server time) on first use.
async function getOrStartTrial(svc: any, email: string): Promise<{ startedAt: string } | null> {
  try {
    const { data } = await svc
      .from('trial_starts')
      .select('started_at')
      .eq('email', email)
      .maybeSingle();
    if (data?.started_at) return { startedAt: data.started_at };
    const { data: fresh } = await svc
      .from('trial_starts')
      .insert({ email })
      .select('started_at')
      .single();
    if (fresh?.started_at) return { startedAt: fresh.started_at };
    return null;
  } catch {
    return null;
  }
}

function trialLeftDays(startedAt: string): number {
  return Math.max(
    0,
    TRIAL_DAYS - Math.floor((Date.now() - new Date(startedAt).getTime()) / 86400000)
  );
}

/**
 * Gate for paid/AI endpoints. Requires a logged-in Google session AND
 * (active subscription OR live trial). Enforces a per-email daily AI cap.
 * Returns { email, isSub } on success, or an error Response (401/403/429).
 */
export async function requireAI(
  req: Request
): Promise<{ email: string; isSub: boolean } | Response> {
  const email = await getSessionEmail(req);
  if (!email) {
    return Response.json(
      { error: 'سجّل دخولك الأول • Sign in required' },
      { status: 401 }
    );
  }
  let svc: any;
  try {
    svc = createServiceClient();
  } catch (e: any) {
    console.error('[guard] service client missing:', e?.message || e);
    return Response.json({ error: 'Service unavailable' }, { status: 500 });
  }

  const isSub = await hasActiveSubscription(svc, email);
  if (!isSub) {
    const trial = await getOrStartTrial(svc, email);
    if (!trial || trialLeftDays(trial.startedAt) <= 0) {
      return Response.json(
        {
          error: 'خلصت تجربتك المجانية — اشترك عشان تكمل • Trial ended, please subscribe',
          upgrade: true,
        },
        { status: 403 }
      );
    }
  }

  const cap = isSub ? SUB_DAILY_AI_CAP : TRIAL_DAILY_AI_CAP;
  try {
    const { data, error } = await svc.rpc('check_and_bump_ai_quota', {
      p_email: email,
      p_cap: cap,
    });
    if (!error && data === false) {
      return Response.json(
        {
          error: 'خلصت رسائل النهاردة — ارجع بكرة • Daily limit reached, back tomorrow',
          upgrade: true,
        },
        { status: 429 }
      );
    }
  } catch {}
  return { email, isSub };
}
