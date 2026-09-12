import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { getPlan } from '@/lib/subscription';
import { checkAdmin } from '../auth';

export const runtime = 'nodejs';

// GET /api/admin/requests → list requests (or ?id= for single WITH screenshot)
export async function GET(req: NextRequest) {
  if (!(await checkAdmin(req))) return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (new URL(req.url).searchParams.get('id')) return getOne(req);
  try {
    const supabase = createServiceClient();
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

// GET /api/admin/requests?id=X → single request WITH screenshot (heavy, on demand)
async function getOne(req: NextRequest) {
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('payment_requests').select('*').eq('id', id).single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ request: data });
}

// PATCH /api/admin/requests → { id, action: 'approve' | 'reject' }
export async function PATCH(req: NextRequest) {
  if (!(await checkAdmin(req))) return Response.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const { id, action } = await req.json();
    if (!id || !['approve', 'reject'].includes(action)) {
      return Response.json({ error: 'Bad request' }, { status: 400 });
    }
    const supabase = createServiceClient();
    const { data: pr, error: e1 } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('id', id)
      .single();
    if (e1 || !pr) return Response.json({ error: 'Not found' }, { status: 404 });

    const status = action === 'approve' ? 'approved' : 'rejected';
    const { error: e2 } = await supabase.from('payment_requests').update({ status, reviewed_at: new Date().toISOString() }).eq('id', id);
    if (e2) return Response.json({ error: 'Update failed: ' + e2.message }, { status: 500 });

    let expiresAt: string | null = null;
    if (action === 'approve') {
      const plan = getPlan(pr.plan);
      // extend from current expiry if still active
      const { data: existing } = await supabase.from('subscriptions').select('expires_at').eq('email', pr.email).maybeSingle();
      const base = existing && new Date(existing.expires_at).getTime() > Date.now() ? new Date(existing.expires_at).getTime() : Date.now();
      expiresAt = new Date(base + plan.days * 86400000).toISOString();
      const { error: e3 } = await supabase.from('subscriptions').upsert({ email: pr.email, plan: pr.plan, expires_at: expiresAt, status: 'active', updated_at: new Date().toISOString() });
      if (e3) return Response.json({ error: 'Activate failed: ' + e3.message }, { status: 500 });
    }
    return Response.json({ status, expiresAt });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
