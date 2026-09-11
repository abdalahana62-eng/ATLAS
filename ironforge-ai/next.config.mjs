import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // فقط للـ APK الأوفلاين نحتاج export + trailingSlash، أما Vercel فلازم يكون بدونهم عشان الـ API يشتغل بدون 308 redirect
  ...(process.env.BUILD_TARGET === 'capacitor' ? { output: 'export', trailingSlash: true } : { trailingSlash: false }),
  images: { unoptimized: true },
  // CORS for the Capacitor APK (https://localhost → this API).
  // Ignored in the static capacitor export; active on Vercel where the API runs.
  async headers() {
    if (process.env.BUILD_TARGET === 'capacitor') return [];
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

export default withNextIntl(nextConfig);
