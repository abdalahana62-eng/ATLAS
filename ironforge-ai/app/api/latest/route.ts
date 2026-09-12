import { NextRequest } from 'next/server';
import { corsHeadersFor, corsPreflight } from '@/lib/security/cors';

export const runtime = 'nodejs';

export async function OPTIONS(req: NextRequest) {
  const pre = corsPreflight(req);
  if (pre) return pre;
  return new Response(null, { status: 204, headers: corsHeadersFor(req) });
}

export async function GET(req: NextRequest) {
  const corsHeaders = corsHeadersFor(req);
  try {
    const repo = 'abdalahana62-eng/ATLAS';
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'ATLAS-App',
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error('[latest] GitHub API failed:', res.status);
      return Response.json(
        { error: 'Update check failed' },
        { status: 502, headers: corsHeaders }
      );
    }

    const data = await res.json();
    const tag = (data.tag_name || '').replace(/^v/, '');
    const apkAsset = data.assets?.find((a: any) => a.name.endsWith('.apk'));
    const url = apkAsset?.browser_download_url || data.html_url;

    return Response.json(
      { tag, version: tag, url, html_url: data.html_url, published_at: data.published_at },
      { headers: corsHeaders }
    );
  } catch (e: any) {
    console.error('[latest] failed:', e?.message || e);
    return Response.json({ error: 'Update check failed' }, { status: 500, headers: corsHeaders });
  }
}
