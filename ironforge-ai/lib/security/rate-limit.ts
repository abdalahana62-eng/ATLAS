// Sliding-window rate limiter.
// - Uses Upstash Redis when UPSTASH_REDIS_REST_URL/TOKEN are set (distributed, works on Vercel).
// - Falls back to in-memory per-instance throttle otherwise (best-effort only).
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodic cleanup so the map can't grow forever.
let lastSweep = 0;
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(k);
  }
  // Hard cap: drop oldest entries if abused with many distinct keys.
  if (buckets.size > 10_000) {
    const keys = buckets.keys();
    for (let i = 0; i < 2000; i++) {
      const k = keys.next().value;
      if (k === undefined) break;
      buckets.delete(k);
    }
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  sweep(now);
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: Math.max(0, limit - 1), resetAt };
  }
  if (b.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: b.resetAt };
  }
  b.count += 1;
  return { allowed: true, remaining: limit - b.count, resetAt: b.resetAt };
}

export function getClientIp(req: Request): string {
  const h = (n: string) => req.headers.get(n) || '';
  // Vercel/Proxies: first public IP only, ignore private ranges to stop spoofing.
  const xf = h('x-forwarded-for').split(',').map((s) => s.trim()).find((s) => s && !/^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\.|^127\./.test(s));
  if (xf) return xf.slice(0, 64);
  const xr = h('x-real-ip').trim();
  if (xr) return xr.slice(0, 64);
  return 'unknown';
}

async function upstashCheck(key: string, limit: number, windowSec: number): Promise<{ allowed: boolean; resetAt: number } | null> {  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return null;
    const now = Date.now();
    // Fixed window via INCR + EXPIRE (simple, distributed).
    const incr = await fetch(`${url.replace(/\/$/, '')}/incr/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json()).catch(() => null);
    const count = Number(incr?.result ?? NaN);
    if (!Number.isFinite(count)) return null;
    if (count === 1) {
      await fetch(`${url.replace(/\/$/, '')}/expire/${encodeURIComponent(key)}/${windowSec}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    return { allowed: count <= limit, resetAt: now + windowSec * 1000 };
  } catch {
    return null;
  }
}

// Strict throttle for admin auth: 10 attempts / minute / IP.
export function adminRateLimited(req: Request): Response | null {
  const ip = getClientIp(req);
  // Combine IP + email header so attacker can't share bucket across targets cheaply.
  const emailHint = (req.headers.get('x-admin-email') || '').toLowerCase().trim().slice(0, 64);
  const r = rateLimit(`admin:${ip}:${emailHint || 'noemail'}`, 10, 60_000);
  if (!r.allowed) {
    return Response.json(
      { error: 'Too many attempts — try again in a minute' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.max(1, Math.ceil((r.resetAt - Date.now()) / 1000))) },
      }
    );
  }
  return null;
}

// General API throttle: 60 req / minute / IP.
export function apiRateLimited(req: Request, scope: string, limit = 60): Response | null {
  const ip = getClientIp(req);
  const r = rateLimit(`api:${scope}:${ip}`, limit, 60_000);
  if (!r.allowed) {
    return Response.json(
      { error: 'Too many requests — slow down' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.max(1, Math.ceil((r.resetAt - Date.now()) / 1000))) },
      }
    );
  }
  return null;
}

// AI/billing throttle: burst protection BEFORE quota check (stops quota-burn).
// Default 20 req/min/IP for paid AI endpoints. Use at top of every requireAI route.
export function aiRateLimited(req: Request, scope: string, limit = 20): Response | null {
  const r = apiRateLimited(req, `ai:${scope}`, limit);
  if (r) return r;
  return null;
}
