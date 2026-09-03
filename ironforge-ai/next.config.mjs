import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // فقط للـ APK الأوفلاين نحتاج export، أما Vercel فلازم يكون بدون output عشان الـ API يشتغل
  ...(process.env.BUILD_TARGET === 'capacitor' ? { output: 'export' } : {}),
  images: { unoptimized: true },
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

export default withNextIntl(nextConfig);
