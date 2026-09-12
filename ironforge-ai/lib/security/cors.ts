// Central allow-list for CORS. Same-origin web requests don't need CORS at all;
// this only matters for the Capacitor APK (https://localhost / capacitor://localhost)
// and local dev. NEVER use '*' on API routes.
const DEFAULT_ALLOWED = [
  'https://localhost',
  'capacitor://localhost',
  'http://localhost:3000',
  'http://localhost:8081',
];

function extraAllowed(): string[] {
  const raw =
    process.env.ALLOWED_ORIGINS || process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || '';
  return raw
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  const o = origin.replace(/\/$/, '');
  const all = [...DEFAULT_ALLOWED.map((d) => d.replace(/\/$/, '')), ...extraAllowed()];
  if (all.includes(o)) return true;
  // Allow the production Vercel deployments of this project (*.vercel.app is
  // still broad, so prefer setting ALLOWED_ORIGINS/APP_URL explicitly).
  // NOTE: keep this narrow — no arbitrary subdomains.
  return false;
}

// Returns CORS headers to attach to an API response. Returns {} when the
// request origin is not allow-listed (browser will block cross-origin read).
// Same-origin requests work with or without these headers.
export function corsHeadersFor(req: Request): Record<string, string> {
  const origin = req.headers.get('origin');
  if (origin && isAllowedOrigin(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      Vary: 'Origin',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-email, x-admin-password',
      'Access-Control-Max-Age': '86400',
    };
  }
  return {};
}

export function corsPreflight(req: Request): Response | null {
  if (req.method !== 'OPTIONS') return null;
  const headers = corsHeadersFor(req);
  // If origin not allowed, still answer 204 but WITHOUT Allow-Origin so the
  // browser blocks the actual request.
  return new Response(null, { status: 204, headers });
}
