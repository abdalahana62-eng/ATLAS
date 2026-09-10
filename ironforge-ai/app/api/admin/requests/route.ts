import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { OWNER_EMAIL, getPlan } from '@/lib/subscription';

export const runtime = 'nodejs';

function isAdmin(req: NextRequest): boolean {
  const key = req.headers.get('x-admin-email')?.toLowerCase().trim();
  const secret = (process.env.ADMIN_EMAIL || OWNER_EMAIL).toLowerCase();
  return !!key && key === secret;
}

// GET /api/admin/requests → list requests (pending first). Header: x-admin-email
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const supabase = createClient();
    const status = new URL(req.url).searchParams.get('status') || 'pending';
    const { data, error } = await supabase
      .from('payment_requests')
      .select('id,email,phone,plan,amount,method,status,created_at')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ requests: data });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// PATCH /api/admin/requests → { id, action: 'approve' | 'reject' }
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const { id, action } = await req.json();
    if (!id || !['approve', 'reject'].includes(action)) {
      return Response.json({ error: 'Bad request' }, { status: 400 });
    }
    const supabase = createClient();
    const { data: pr, error: e1 } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('id', id)
      .single();
    if (e1 || !pr) return Response.json({ error: 'Not found' }, { status: 404 });

    const status = action === 'approve' ? 'approved' : 'rejected';
    await supabase.from('payment_requests').update({ status, reviewed_at: new Date().toISOString() }).eq('id', id);

    let expiresAt: string | null = null;
    if (action === 'approve') {
      const plan = getPlan(pr.plan);
      // extend from current expiry if still active
      const { data: existing } = await supabase.from('subscriptions').select('expires_at').eq('email', pr.email).maybeSingle();
      const base = existing && new Date(existing.expires_at).getTime() > Date.now() ? new Date(existing.expires_at).getTime() : Date.now();
      expiresAt = new Date(base + plan.days * 86400000).toISOString();
      await supabase.from('subscriptions').upsert({ email: pr.email, plan: pr.plan, expires_at: expiresAt, status: 'active', updated_at: new Date().toISOString() });
    }
    return Response.json({ status, expiresAt });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
