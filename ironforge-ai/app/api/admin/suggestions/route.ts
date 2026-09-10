import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAdmin } from '../auth';

export const runtime = 'nodejs';

// GET /api/admin/suggestions → list all (owner only)
export async function GET(req: NextRequest) {
  if (!(await checkAdmin(req))) return Response.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('suggestions')
      .select('id,email,message,status,created_at')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ suggestions: data });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// PATCH /api/admin/suggestions → { id, action: 'read' | 'delete' }
export async function PATCH(req: NextRequest) {
  if (!(await checkAdmin(req))) return Response.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const { id, action } = await req.json();
    const supabase = createClient();
    if (action === 'read') {
      await supabase.from('suggestions').update({ status: 'read' }).eq('id', id);
    } else if (action === 'delete') {
      await supabase.from('suggestions').delete().eq('id', id);
    }
    return Response.json({ ok: true });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/admin/suggestions → public submit { email, message }
export async function POST(req: NextRequest) {
  try {
    const { email, message } = await req.json();
    if (!email || !message?.trim() || message.trim().length > 1000) {
      return Response.json({ error: 'Bad request' }, { status: 400 });
    }
    const supabase = createClient();
    const { error } = await supabase.from('suggestions').insert({ email: email.toLowerCase().trim(), message: message.trim() });
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ ok: true });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
