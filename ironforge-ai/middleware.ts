import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';
import { corsHeadersFor } from './lib/security/cors';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/')) {
    // Locked-down CORS: only allow-listed origins (APK/local/prod).
    // Same-origin web requests work with or without these headers.
    const headers = corsHeadersFor(req);
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers });
    }
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(headers)) res.headers.set(k, v);
    return res;
  }

  // Top-level OAuth fallback page: no locale handling needed.
  if (pathname === '/auth/callback' || pathname.startsWith('/auth/callback/')) {
    // Still refresh the Supabase session cookies so getUser() works server-side.
    try {
      return await updateSession(req);
    } catch {
      return NextResponse.next();
    }
  }

  // Refresh Supabase auth cookies, then apply locale routing (preserving cookies).
  try {
    const sessionRes = await updateSession(req);
    const intlRes = (intlMiddleware as any)(req);
    const out: NextResponse = intlRes instanceof Promise ? await intlRes : intlRes;
    for (const c of sessionRes.cookies.getAll()) {
      out.cookies.set(c.name, c.value, c as any);
    }
    return out;
  } catch {
    return (intlMiddleware as any)(req);
  }
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
