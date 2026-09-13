import { NextRequest } from 'next/server';
import { guardAdmin } from '../auth';
import { corsHeadersFor } from '@/lib/security/cors';
import { apiRateLimited } from '@/lib/security/rate-limit';
import { isEmail, isText } from '@/lib/security/validate';

export const runtime = 'nodejs';

// POST /api/admin/send-email → { to, subject, message } via Resend (needs RESEND_API_KEY)
// Hardened: strict 5/min rate-limit + recipient must be an existing subscriber
// (stops spam-cannon if admin creds leak) + generic errors only.
export async function POST(req: NextRequest) {
  const cors = corsHeadersFor(req);
  const burst = await apiRateLimited(req, 'admin-send-email', 5);
  if (burst) return Response.json({ error: 'Too many requests — slow down' }, { status: 429, headers: cors });
  const denied = await guardAdmin(req);
  if (denied) return Response.json({ error: 'Forbidden' }, { status: denied.status, headers: cors });
  try {
    const { to, subject, message } = await req.json();
    if (!isEmail(to) || !isText(subject, 1, 200) || !isText(message, 1, 5000)) {
      return Response.json({ error: 'Missing fields' }, { status: 400, headers: cors });
    }
    // Anti-spam: only mail existing users (subscribers or payment requesters).
    // Prevents turning a leaked admin password into an open relay.
    try {
      const { createServiceClient } = await import('@/lib/supabase/service');
      const svc = createServiceClient();
      const target = String(to).toLowerCase().trim();
      const [s1, s2] = await Promise.all([
        svc.from('subscriptions').select('email').eq('email', target).maybeSingle(),
        svc.from('payment_requests').select('email').eq('email', target).limit(1),
      ]);
      const known = !!(s1.data || (Array.isArray(s2.data) && s2.data.length > 0));
      if (!known) return Response.json({ error: 'Unknown recipient' }, { status: 404, headers: cors });
    } catch {
      return Response.json({ error: 'Internal error' }, { status: 500, headers: cors });
    }
    const key = process.env.RESEND_API_KEY;
    if (!key) return Response.json({ error: 'Email service not configured' }, { status: 503, headers: cors });
    const from = process.env.RESEND_FROM || 'ATLAS <noreply@atlasfit.pro>';
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [String(to).toLowerCase().trim()], subject: String(subject).trim().slice(0, 200), text: String(message).trim().slice(0, 5000) }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error('[admin/send-email] resend failed:', r.status);
      return Response.json({ error: 'Send failed' }, { status: 500, headers: cors });
    }
    return Response.json({ id: d.id }, { headers: cors });
  } catch (e: any) {
    console.error('[admin/send-email] failed:', e?.message || e);
    return Response.json({ error: 'Internal error' }, { status: 500, headers: cors });
  }
}
