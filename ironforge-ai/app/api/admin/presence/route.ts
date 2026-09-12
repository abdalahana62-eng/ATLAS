import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { checkAdmin } from '../auth';

export const runtime = 'nodejs';

// GET /api/admin/presence → currently-online users (owner only).
// Online = heartbeat within the last 90 seconds.
export async function GET(req: NextRequest) {
  if (!(await checkAdmin(req))) return Response.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const supabase = createServiceClient();
    const cutoff = new Date(Date.now() - 90000).toISOString();
    const { data, error } = await supabase
      .from('user_presence')
      .select('email,platform,last_seen')
      .gt('last_seen', cutoff)
      .order('last_seen', { ascending: false })
      .limit(50);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ online: data || [] });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
