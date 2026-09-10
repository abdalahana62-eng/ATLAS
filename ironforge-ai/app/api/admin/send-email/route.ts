import { NextRequest } from 'next/server';
import { checkAdmin } from '../auth';

export const runtime = 'nodejs';

// POST /api/admin/send-email → { to, subject, message } via Resend (needs RESEND_API_KEY)
export async function POST(req: NextRequest) {
  if (!(await checkAdmin(req))) return Response.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const { to, subject, message } = await req.json();
    if (!to || !subject || !message) return Response.json({ error: 'Missing fields' }, { status: 400 });
    const key = process.env.RESEND_API_KEY;
    if (!key) return Response.json({ error: 'Email service not configured (RESEND_API_KEY)' }, { status: 503 });
    const from = process.env.RESEND_FROM || 'ATLAS <noreply@atlasfit.pro>';
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, text: message }),
    });
    const d = await r.json();
    if (!r.ok) return Response.json({ error: d.message || 'Send failed' }, { status: 500 });
    return Response.json({ id: d.id });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
