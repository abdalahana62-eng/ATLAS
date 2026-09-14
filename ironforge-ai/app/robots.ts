import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard', '/onboarding', '/auth/callback'],
      },
      // امنع bots من API تحديداً
      {
        userAgent: '*',
        disallow: '/api/',
      },
    ],
    sitemap: 'https://atlasfit.pro/sitemap.xml',
  };
}
