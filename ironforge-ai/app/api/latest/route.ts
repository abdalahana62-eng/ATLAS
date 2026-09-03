import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
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
      const text = await res.text();
      return Response.json(
        { error: `GitHub API ${res.status}`, details: text.slice(0, 300), repo, hasToken: !!token },
        { status: res.status, headers: corsHeaders }
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
    return Response.json({ error: e?.message || 'Failed' }, { status: 500, headers: corsHeaders });
  }
}
