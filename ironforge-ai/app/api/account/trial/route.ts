import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { getSessionEmail } from '@/lib/api/guard';
import { apiRateLimited } from '@/lib/security/rate-limit';
import { TRIAL_DAYS } from '@/lib/subscription';

export const runtime = 'nodejs';

// GET /api/account/trial?email=x → { startedAt, trialLeft }.
// Strict: email must match the logged-in session (no harvesting others' clocks).
export async function GET(req: NextRequest) {
  try {
    const limited = await apiRateLimited(req, 'trial-get', 30);
    if (limited) return limited;
    const email = new URL(req.url).searchParams.get('email')?.toLowerCase().trim();
    if (!email) return Response.json({ error: 'Missing email' }, { status: 400 });
    const sessionEmail = await getSessionEmail();
    if (!sessionEmail || sessionEmail !== email) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('trial_starts')
      .select('started_at')
      .eq('email', email)
      .maybeSingle();
    if (error || !data) return Response.json({ startedAt: null, trialLeft: null });
    const left = Math.max(
      0,
      TRIAL_DAYS - Math.floor((Date.now() - new Date((data as any).started_at).getTime()) / 86400000)
    );
    return Response.json({ startedAt: (data as any).started_at, trialLeft: left });
  } catch (e: any) {
    console.error('[trial] GET failed:', e?.message || e);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}

// POST /api/account/trial { email } → registers trial start.
// Security: email must match the session; started_at ALWAYS comes from the
// server clock (client-supplied dates are ignored — stops future-date cheats
// and pre-registration theft). First device wins: existing rows never change.
export async function POST(req: NextRequest) {
  try {
    const limited = await apiRateLimited(req, 'trial-post', 10);
    if (limited) return limited;
    const { email } = await req.json();
    const em = String(email || '').toLowerCase().trim();
    if (!em) return Response.json({ error: 'Missing email' }, { status: 400 });
    const sessionEmail = await getSessionEmail();
    if (!sessionEmail || sessionEmail !== em) {
      return Response.json({ error: 'Sign in with this email first' }, { status: 403 });
    }
    const supabase = createServiceClient();
    const { error } = await supabase.from('trial_starts').upsert(
      { email: em, started_at: new Date().toISOString() },
      { onConflict: 'email', ignoreDuplicates: true }
    );
    if (error) {
      console.error('[trial] POST failed:', error.message);
      return Response.json({ error: 'Could not save' }, { status: 500 });
    }
    const { data } = await supabase
      .from('trial_starts')
      .select('started_at')
      .eq('email', em)
      .maybeSingle();
    return Response.json({ startedAt: (data as any)?.started_at ?? null });
  } catch (e: any) {
    console.error('[trial] POST failed:', e?.message || e);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
