import type { MetadataRoute } from 'next';

const BASE = 'https://atlasfit.pro';
// Public, index-worthy pages only (app pages sit behind login)
const PAGES = ['', '/pricing', '/auth/signup'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PAGES.flatMap((p) => [
    {
      url: `${BASE}${p || '/'}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: p === '' ? 1 : 0.8,
      alternates: { languages: { ar: `${BASE}${p || '/'}`, en: `${BASE}/en${p}` } },
    },
    {
      url: `${BASE}/en${p}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: p === '' ? 0.9 : 0.7,
    },
  ]);
}
