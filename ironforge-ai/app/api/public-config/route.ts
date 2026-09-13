import { NextRequest } from 'next/server';
import { apiRateLimited } from '@/lib/security/rate-limit';
import { corsHeadersFor } from '@/lib/security/cors';

export const runtime = 'nodejs';

// GET /api/public-config → { payNumber }
// Rate-limited to slow scraping. The number must be visible to pay,
// but we avoid bundling it in static JS (harvesters scan bundles).
export async function GET(req: NextRequest) {
  const cors = corsHeadersFor(req);
  const limited = await apiRateLimited(req, 'public-config', 30);
  if (limited) return Response.json({ error: 'Too many requests' }, { status: 429, headers: cors });
  const payNumber = process.env.PAY_NUMBER || '';
  if (!payNumber) return Response.json({ error: 'Not configured' }, { status: 503, headers: cors });
  return Response.json({ payNumber }, { headers: { ...cors, 'Cache-Control': 'no-store' } });
}
