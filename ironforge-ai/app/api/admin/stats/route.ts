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
    if (!error && data) return Response.json(data);
    // Fallback: count tables directly (works even if rpc missing)
    const out: any = { users: 0, activeSubs: 0, pending: 0, totalRequests: 0, fallback: true };
    try {
      const r = await supabase.from('profiles').select('id', { count: 'exact', head: true });
      out.users = r.count ?? 0;
    } catch {}
    try {
      const r = await supabase.from('subscriptions').select('email', { count: 'exact' }).eq('status', 'active').gt('expires_at', new Date().toISOString());
      out.activeSubs = (r.data as any[])?.length ?? r.count ?? 0;
    } catch {}
    try {
      const r = await supabase.from('payment_requests').select('id', { count: 'exact' }).eq('status', 'pending');
      out.pending = (r.data as any[])?.length ?? r.count ?? 0;
      const r2 = await supabase.from('payment_requests').select('id', { count: 'exact', head: true });
      out.totalRequests = r2.count ?? 0;
    } catch {}
    return Response.json(out);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
