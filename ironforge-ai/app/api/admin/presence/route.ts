import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { guardAdmin } from '../auth';
import { corsHeadersFor } from '@/lib/security/cors';

export const runtime = 'nodejs';

// GET /api/admin/presence → currently-online users (owner only).
// Online = heartbeat within the last 90 seconds.
export async function GET(req: NextRequest) {
  const cors = corsHeadersFor(req);
  const denied = await guardAdmin(req);
  if (denied) return Response.json({ error: 'Forbidden' }, { status: denied.status, headers: cors });
  try {
    const supabase = createServiceClient();
    const cutoff = new Date(Date.now() - 90000).toISOString();
    const { data, error } = await supabase
      .from('user_presence')
      .select('email,platform,last_seen')
      .gt('last_seen', cutoff)
      .order('last_seen', { ascending: false })
      .limit(50);
    if (error) {
      console.error('[admin/presence] failed:', error.message);
      return Response.json({ error: 'Internal error' }, { status: 500, headers: cors });
    }
    return Response.json({ online: data || [] }, { headers: cors });
  } catch (e: any) {
    console.error('[admin/presence] failed:', e?.message || e);
    return Response.json({ error: 'Internal error' }, { status: 500, headers: cors });
  }
}
