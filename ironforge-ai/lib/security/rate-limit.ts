// In-memory sliding-window rate limiter — zero external deps, works on Vercel.
// NOTE: on serverless each instance has its own memory, so this is a
// best-effort per-instance throttle (stops single-source brute force / spam).
// For distributed throttling across many instances, swap with Upstash Redis later.
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
  const xf = h('x-forwarded-for').split(',')[0].trim();
  if (xf) return xf.slice(0, 64);
  const xr = h('x-real-ip').trim();
  if (xr) return xr.slice(0, 64);
  return 'unknown';
}

// Strict throttle for admin auth: 10 attempts / minute / IP.
export function adminRateLimited(req: Request): Response | null {
  const ip = getClientIp(req);
  const r = rateLimit(`admin:${ip}`, 10, 60_000);
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
