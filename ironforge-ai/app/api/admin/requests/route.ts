import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { getPlan } from '@/lib/subscription';
import { guardAdmin } from '../auth';
import { corsHeadersFor } from '@/lib/security/cors';
import { isUuid } from '@/lib/security/validate';

export const runtime = 'nodejs';

// GET /api/admin/requests → list requests (or ?id= for single WITH screenshot)
export async function GET(req: NextRequest) {
  const cors = corsHeadersFor(req);
  const denied = await guardAdmin(req);
  if (denied) return Response.json({ error: 'Forbidden' }, { status: denied.status, headers: cors });
  if (new URL(req.url).searchParams.get('id')) return getOne(req);
  try {
    const supabase = createServiceClient();
    const rawStatus = new URL(req.url).searchParams.get('status') || 'pending';
    const status = ['pending', 'approved', 'rejected'].includes(rawStatus) ? rawStatus : 'pending';
    const { data, error } = await supabase
      .from('payment_requests')
      .select('id,email,phone,plan,amount,method,status,created_at')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) {
      console.error('[admin/requests] list failed:', error.message);
      return Response.json({ error: 'Internal error' }, { status: 500, headers: cors });
    }
    return Response.json({ requests: data }, { headers: cors });
  } catch (e: any) {
    console.error('[admin/requests] failed:', e?.message || e);
    return Response.json({ error: 'Internal error' }, { status: 500, headers: cors });
  }
}

// GET /api/admin/requests?id=X → single request WITH screenshot (heavy, on demand)
async function getOne(req: NextRequest) {
  const cors = corsHeadersFor(req);
  const id = new URL(req.url).searchParams.get('id');
  if (!id || !isUuid(id)) return Response.json({ error: 'Missing id' }, { status: 400, headers: cors });
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('payment_requests').select('*').eq('id', id).single();
    if (error) {
      console.error('[admin/requests] getOne failed:', error.message);
      return Response.json({ error: 'Not found' }, { status: 404, headers: cors });
    }
    return Response.json({ request: data }, { headers: cors });
  } catch (e: any) {
    console.error('[admin/requests] getOne failed:', e?.message || e);
    return Response.json({ error: 'Internal error' }, { status: 500, headers: cors });
  }
}

// PATCH /api/admin/requests → { id, action: 'approve' | 'reject' }
export async function PATCH(req: NextRequest) {
  const cors = corsHeadersFor(req);
  const denied = await guardAdmin(req);
  if (denied) return Response.json({ error: 'Forbidden' }, { status: denied.status, headers: cors });
  try {
    const { id, action } = await req.json();
    if (!isUuid(id) || !['approve', 'reject'].includes(action)) {
      return Response.json({ error: 'Bad request' }, { status: 400, headers: cors });
    }
    const supabase = createServiceClient();
    const { data: pr, error: e1 } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('id', id)
      .single();
    if (e1 || !pr) return Response.json({ error: 'Not found' }, { status: 404, headers: cors });

    const status = action === 'approve' ? 'approved' : 'rejected';
    const { error: e2 } = await supabase.from('payment_requests').update({ status, reviewed_at: new Date().toISOString() }).eq('id', id);
    if (e2) {
      console.error('[admin/requests] update failed:', e2.message);
      return Response.json({ error: 'Update failed' }, { status: 500, headers: cors });
    }

    let expiresAt: string | null = null;
    if (action === 'approve') {
      const plan = getPlan(pr.plan);
      // extend from current expiry if still active
      const { data: existing } = await supabase.from('subscriptions').select('expires_at').eq('email', pr.email).maybeSingle();
      const base = existing && new Date(existing.expires_at).getTime() > Date.now() ? new Date(existing.expires_at).getTime() : Date.now();
      expiresAt = new Date(base + plan.days * 86400000).toISOString();
      const { error: e3 } = await supabase.from('subscriptions').upsert({ email: pr.email, plan: pr.plan, expires_at: expiresAt, status: 'active', updated_at: new Date().toISOString() });
      if (e3) {
        console.error('[admin/requests] activate failed:', e3.message);
        return Response.json({ error: 'Activate failed' }, { status: 500, headers: cors });
      }
    }
    return Response.json({ status, expiresAt }, { headers: cors });
  } catch (e: any) {
    console.error('[admin/requests] patch failed:', e?.message || e);
    return Response.json({ error: 'Internal error' }, { status: 500, headers: cors });
  }
}
