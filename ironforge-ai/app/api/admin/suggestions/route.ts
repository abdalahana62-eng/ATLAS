import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { guardAdmin } from '../auth';
import { corsHeadersFor } from '@/lib/security/cors';
import { apiRateLimited } from '@/lib/security/rate-limit';
import { isEmail, isText, isUuid } from '@/lib/security/validate';

export const runtime = 'nodejs';

// GET /api/admin/suggestions → list all (owner only)
export async function GET(req: NextRequest) {
  const cors = corsHeadersFor(req);
  const denied = await guardAdmin(req);
  if (denied) return Response.json({ error: 'Forbidden' }, { status: denied.status, headers: cors });
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('suggestions')
      .select('id,email,message,status,created_at')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) {
      console.error('[admin/suggestions] list failed:', error.message);
      return Response.json({ error: 'Internal error' }, { status: 500, headers: cors });
    }
    return Response.json({ suggestions: data }, { headers: cors });
  } catch (e: any) {
    console.error('[admin/suggestions] list failed:', e?.message || e);
    return Response.json({ error: 'Internal error' }, { status: 500, headers: cors });
  }
}

// PATCH /api/admin/suggestions → { id, action: 'read' | 'delete' }
export async function PATCH(req: NextRequest) {
  const cors = corsHeadersFor(req);
  const denied = await guardAdmin(req);
  if (denied) return Response.json({ error: 'Forbidden' }, { status: denied.status, headers: cors });
  try {
    const { id, action } = await req.json();
    if (!isUuid(id) || !['read', 'delete'].includes(action)) {
      return Response.json({ error: 'Bad request' }, { status: 400, headers: cors });
    }
    const supabase = createServiceClient();
    if (action === 'read') {
      await supabase.from('suggestions').update({ status: 'read' }).eq('id', id);
    } else if (action === 'delete') {
      await supabase.from('suggestions').delete().eq('id', id);
    }
    return Response.json({ ok: true }, { headers: cors });
  } catch (e: any) {
    console.error('[admin/suggestions] patch failed:', e?.message || e);
    return Response.json({ error: 'Internal error' }, { status: 500, headers: cors });
  }
}

// POST /api/admin/suggestions → public submit { email, message }
export async function POST(req: NextRequest) {
  const cors = corsHeadersFor(req);
  const limited = await apiRateLimited(req, 'suggestions', 10);
  if (limited) return Response.json({ error: 'Too many requests — slow down' }, { status: 429, headers: cors });
  try {
    const { email, message } = await req.json();
    if (!isEmail(email) || !isText(message, 1, 1000)) {
      return Response.json({ error: 'Bad request' }, { status: 400, headers: cors });
    }
    const supabase = createClient();
    const { error } = await supabase.from('suggestions').insert({ email: String(email).toLowerCase().trim(), message: String(message).trim().slice(0, 1000) });
    if (error) {
      console.error('[suggestions] insert failed:', error.message);
      return Response.json({ error: 'Could not save' }, { status: 500, headers: cors });
    }
    return Response.json({ ok: true }, { headers: cors });
  } catch (e: any) {
    console.error('[suggestions] failed:', e?.message || e);
    return Response.json({ error: 'Internal error' }, { status: 500, headers: cors });
  }
}
