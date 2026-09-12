import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { guardAdmin } from '../auth';
import { corsHeadersFor } from '@/lib/security/cors';

export const runtime = 'nodejs';

// GET /api/admin/subscribers → [{ email, plan, expires_at, daysLeft }]
export async function GET(req: NextRequest) {
  const cors = corsHeadersFor(req);
  const denied = await guardAdmin(req);
  if (denied) return Response.json({ error: 'Forbidden' }, { status: denied.status, headers: cors });
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('subscriptions')
      .select('email,plan,expires_at,status,created_at')
      .order('expires_at', { ascending: false })
      .limit(500);
    if (error) {
      console.error('[admin/subscribers] failed:', error.message);
      return Response.json({ error: 'Internal error' }, { status: 500, headers: cors });
    }
    const now = Date.now();
    const list = (data || []).map((s: any) => ({
      ...s,
      daysLeft: Math.max(0, Math.ceil((new Date(s.expires_at).getTime() - now) / 86400000)),
    }));
    return Response.json({ subscribers: list }, { headers: cors });
  } catch (e: any) {
    console.error('[admin/subscribers] failed:', e?.message || e);
    return Response.json({ error: 'Internal error' }, { status: 500, headers: cors });
  }
}
