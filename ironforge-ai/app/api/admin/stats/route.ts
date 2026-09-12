import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { guardAdmin } from '../auth';
import { corsHeadersFor } from '@/lib/security/cors';

export const runtime = 'nodejs';

// GET /api/admin/stats → { users, activeSubs, pending, totalRequests, aiToday, aiYesterday, aiWeek }
async function readAppStats(supabase: ReturnType<typeof createServiceClient>) {
  // Requires migration 010_presence_platform.sql — zeros gracefully if missing.
  const out = { appInstalls: 0, appOnline: 0 };
  try {
    const { data, error } = await supabase.from('user_presence').select('email,platform,last_seen').limit(5000);
    if (error || !data) return out;
    const cutoff = Date.now() - 90000;
    const seen = new Set<string>();
    for (const r of data as any[]) {
      if (r.platform === 'app') {
        seen.add(String(r.email));
        if (new Date(r.last_seen).getTime() > cutoff) out.appOnline += 1;
      }
    }
    out.appInstalls = seen.size;
  } catch {}
  return out;
}

async function readAIUsage(supabase: ReturnType<typeof createServiceClient>) {
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
  const cors = corsHeadersFor(req);
  const denied = await guardAdmin(req);
  if (denied) return Response.json({ error: 'Forbidden' }, { status: denied.status, headers: { ...cors, ...Object.fromEntries(denied.headers.entries()) } });
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.rpc('get_admin_stats');
    if (!error && data) {
      try {
        const ai = await readAIUsage(supabase);
        const app = await readAppStats(supabase);
        return Response.json({ ...data, ...ai, ...app }, { headers: cors });
      } catch {}
      return Response.json(data, { headers: cors });
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
    try {
      Object.assign(out, await readAppStats(supabase));
    } catch {}
    return Response.json(out, { headers: cors });
  } catch (e: any) {
    console.error('[admin/stats] failed:', e?.message || e);
    return Response.json({ error: 'Internal error' }, { status: 500, headers: cors });
  }
}
