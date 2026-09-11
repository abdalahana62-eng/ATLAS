import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAdmin } from '../auth';

export const runtime = 'nodejs';

// GET /api/admin/stats → { users, activeSubs, pending, totalRequests, aiToday, aiYesterday, aiWeek }
async function readAIUsage(supabase: ReturnType<typeof createClient>) {
  // Requires migration 008_ai_usage.sql — returns zeros gracefully if missing.
  const out = { aiToday: 0, aiYesterday: 0, aiWeek: 0 };
  try {
    const today = new Date().toISOString().slice(0, 10);
    const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const weekAgo = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10);
    const { data } = await supabase.from('ai_usage').select('day,count').gte('day', weekAgo);
    for (const r of (data as any[]) || []) {
      const c = Number(r.count) || 0;
      out.aiWeek += c;
      if (r.day === today) out.aiToday += c;
      else if (r.day === y) out.aiYesterday += c;
    }
  } catch {}
  return out;
}

export async function GET(req: NextRequest) {
  if (!(await checkAdmin(req))) return Response.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_admin_stats');
    if (!error && data) {
      try {
        const ai = await readAIUsage(supabase);
        return Response.json({ ...data, ...ai });
      } catch {}
      return Response.json(data);
    }
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
    try {
      Object.assign(out, await readAIUsage(supabase));
    } catch {}
    return Response.json(out);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
