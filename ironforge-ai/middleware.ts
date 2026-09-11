import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// The Capacitor APK (origin https://localhost) talks to this API cross-origin,
// so preflights must succeed. Actual response CORS headers come from
// next.config.mjs headers() for /api/:path*.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/')) {
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
    }
    return NextResponse.next();
  }

  // Top-level OAuth fallback page: no locale handling needed.
  if (pathname === '/auth/callback' || pathname.startsWith('/auth/callback/')) {
    return NextResponse.next();
  }

  return (intlMiddleware as any)(req);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
