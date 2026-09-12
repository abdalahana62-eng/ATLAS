import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { getSessionEmail } from '@/lib/api/guard';

export const runtime = 'nodejs';

// POST /api/presence { email, platform } → heartbeat (upsert last_seen).
// Security: email must match the logged-in session — nobody can fake
// someone else's online status.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || '').toLowerCase().trim();
    const platform = body.platform === 'app' ? 'app' : 'web';
    if (!email) return Response.json({ error: 'Missing email' }, { status: 400 });
    const sessionEmail = await getSessionEmail();
    if (!sessionEmail || sessionEmail !== email) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    const supabase = createServiceClient();
    const { error } = await supabase
      .from('user_presence')
      .upsert({ email, last_seen: new Date().toISOString(), platform });
    if (error) {
      console.error('[presence] failed:', error.message);
      return Response.json({ error: 'Could not save' }, { status: 500 });
    }
    return Response.json({ ok: true });
  } catch (e: any) {
    console.error('[presence] failed:', e?.message || e);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
