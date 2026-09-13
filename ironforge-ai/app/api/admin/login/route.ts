import { timingSafeEqual } from 'crypto';
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminRateLimited } from '@/lib/security/rate-limit';
import { createAdminSessionToken, adminCookieName, adminMaxAge } from '@/lib/security/admin-session';

export const runtime = 'nodejs';

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ab.length !== bb.length) return false;
  try {
    return timingSafeEqual(ab, bb);
  } catch {
    return false;
  }
}

// POST /api/admin/login { email, password } → sets HttpOnly cookie atlas_admin (30min)
// Triple lock still required: ADMIN_EMAIL+PASSWORD + Google session of same email.
// The cookie is HMAC-signed, httpOnly, secure on Vercel, sameSite=strict.
export async function POST(req: NextRequest) {
  const limited = await adminRateLimited(req);
  if (limited) return limited;
  try {
    const { email, password } = await req.json().catch(() => ({}));
    const e = String(email || '').toLowerCase().trim();
    const p = String(password || '');
    const owner = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || '';
    if (!owner || !adminPassword || adminPassword.length < 16) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!e || !safeEqual(e, owner) || !p || !safeEqual(p, adminPassword)) {
      console.error('[admin-login] DENY (credential)');
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    const sessEmail = data.user?.email?.toLowerCase().trim() || '';
    if (!sessEmail || !safeEqual(sessEmail, owner)) {
      console.error('[admin-login] DENY (session)');
      return Response.json({ error: 'Google session required — sign in with Google first' }, { status: 403 });
    }
    const token = createAdminSessionToken(owner);
    const { NextResponse } = await import('next/server');
    const nr = NextResponse.json({ ok: true });
    nr.cookies.set(adminCookieName(), token, {
      httpOnly: true,
      secure: process.env.VERCEL === '1',
      sameSite: 'strict',
      path: '/',
      maxAge: adminMaxAge(),
    });
    return nr;
  } catch (e: any) {
    console.error('[admin-login] failed:', e?.message || e);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
