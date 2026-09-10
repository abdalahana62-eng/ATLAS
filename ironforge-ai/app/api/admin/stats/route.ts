import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAdmin } from '../auth';

export const runtime = 'nodejs';

// GET /api/admin/stats → { users, activeSubs, pending, totalRequests }
export async function GET(req: NextRequest) {
  if (!(await checkAdmin(req))) return Response.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_admin_stats');
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
