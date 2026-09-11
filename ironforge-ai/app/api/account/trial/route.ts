import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TRIAL_DAYS } from '@/lib/subscription';

export const runtime = 'nodejs';

// GET /api/account/trial?email=x → { startedAt, trialLeft }
// The trial clock lives on the SERVER (trial_starts table) so website ↔ app
// share the same 3 free days. Falls back gracefully if migration not run.
export async function GET(req: NextRequest) {
  try {
    const email = new URL(req.url).searchParams.get('email')?.toLowerCase().trim();
    if (!email) return Response.json({ error: 'Missing email' }, { status: 400 });
    const supabase = createClient();
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
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/account/trial { email, startedAt? } → registers trial start.
// First device wins: insert-only, existing rows are never overwritten.
export async function POST(req: NextRequest) {
  try {
    const { email, startedAt } = await req.json();
    const em = String(email || '').toLowerCase().trim();
    if (!em) return Response.json({ error: 'Missing email' }, { status: 400 });
    const supabase = createClient();
    const row: any = { email: em };
    if (startedAt) row.started_at = startedAt;
    const { error } = await supabase.from('trial_starts').upsert(row, {
      onConflict: 'email',
      ignoreDuplicates: true,
    });
    if (error) return Response.json({ error: error.message }, { status: 500 });
    const { data } = await supabase
      .from('trial_starts')
      .select('started_at')
      .eq('email', em)
      .maybeSingle();
    return Response.json({ startedAt: (data as any)?.started_at ?? null });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
