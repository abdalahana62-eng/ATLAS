import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // فقط للـ APK الأوفلاين نحتاج export + trailingSlash، أما Vercel فلازم يكون بدونهم عشان الـ API يشتغل بدون 308 redirect
  ...(process.env.BUILD_TARGET === 'capacitor' ? { output: 'export', trailingSlash: true } : { trailingSlash: false }),
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

export default withNextIntl(nextConfig);
