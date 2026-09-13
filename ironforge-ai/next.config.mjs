import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // فقط للـ APK الأوفلاين نحتاج export + trailingSlash، أما Vercel فلازم يكون بدونهم عشان الـ API يشتغل بدون 308 redirect
  ...(process.env.BUILD_TARGET === 'capacitor' ? { output: 'export', trailingSlash: true } : { trailingSlash: false }),
  images: { unoptimized: true },
  // Security headers for all pages. API CORS is handled dynamically in
  // middleware.ts (allow-list only) — no wildcard here on purpose.
  async headers() {
    if (process.env.BUILD_TARGET === 'capacitor') return [];
    // Next.js needs 'unsafe-inline' for scripts/styles in production build.
    // 'unsafe-eval' is dev-only — removed in production to shrink XSS impact.
    const isDev = process.env.NODE_ENV !== 'production';
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com"
      : "script-src 'self' 'unsafe-inline' https://apis.google.com";
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          { key: 'Origin-Agent-Cluster', value: '?1' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              scriptSrc,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://*.supabase.co https://api.groq.com https://api.github.com https://api.resend.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
          ...(process.env.VERCEL === '1'
            ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
            : []),
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

export default withNextIntl(nextConfig);
