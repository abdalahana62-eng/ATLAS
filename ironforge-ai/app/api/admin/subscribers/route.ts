import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAdmin } from '../auth';

export const runtime = 'nodejs';

// GET /api/admin/subscribers → [{ email, plan, expires_at, daysLeft }]
export async function GET(req: NextRequest) {
  if (!(await checkAdmin(req))) return Response.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('subscriptions')
      .select('email,plan,expires_at,status,created_at')
      .order('expires_at', { ascending: false })
      .limit(500);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    const now = Date.now();
    const list = (data || []).map((s: any) => ({
      ...s,
      daysLeft: Math.max(0, Math.ceil((new Date(s.expires_at).getTime() - now) / 86400000)),
    }));
    return Response.json({ subscribers: list });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
