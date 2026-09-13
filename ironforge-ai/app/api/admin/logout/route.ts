import { NextRequest, NextResponse } from 'next/server';
import { adminCookieName } from '@/lib/security/admin-session';

export const runtime = 'nodejs';

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookieName(), '', {
    httpOnly: true,
    secure: process.env.VERCEL === '1',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return res;
}
