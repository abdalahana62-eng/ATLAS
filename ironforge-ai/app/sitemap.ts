import type { MetadataRoute } from 'next';

const BASE = 'https://atlasfit.pro';
// Public, index-worthy pages only (behind-login pages must NOT be in sitemap)
// /privacy + /terms مطلوبين لموافقة Google Play (روابط ثابتة بدون locale)
const PAGES = ['', '/pricing', '/auth/signup', '/privacy', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PAGES.flatMap((p) => {
    const arUrl = `${BASE}${p || '/'}`;
    const enUrl = `${BASE}/en${p}`;
    return [
      {
        url: arUrl,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: p === '' ? 1 : 0.8,
        alternates: {
          languages: {
            ar: arUrl,
            en: enUrl,
            'x-default': arUrl,
          },
        },
      },
      {
        url: enUrl,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: p === '' ? 0.9 : 0.7,
        alternates: {
          languages: {
            ar: arUrl,
            en: enUrl,
            'x-default': arUrl,
          },
        },
      },
    ];
  });
}
