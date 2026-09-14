import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navigation from '@/components/layout/Navigation';
import UpdateChecker from '@/components/UpdateChecker';
import PresenceTracker from '@/components/PresenceTracker';
import './globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#a3e635',
};

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Home' });
  const isAr = locale === 'ar';
  const title = t('title');
  const description = t('description');
  const canonicalPath = locale === 'ar' ? '/' : '/en';

  // كلمات مفتاحية مركزة للبحث العربي + الإنجليزي
  const keywordsAr = [
    'اطلس',
    'ATLAS',
    'اطلس فت',
    'atlasfit',
    'مدرب كمال اجسام',
    'مدرب ذكاء اصطناعي',
    'كمال اجسام',
    'نظام غذائي مصري',
    'تمارين جيم',
    'تمارين منزلية',
    'حاسبة سعرات',
    'تغذية كمال اجسام',
    'برنامج تمرين',
  ];
  const keywordsEn = [
    'ATLAS',
    'atlasfit',
    'atlasfit.pro',
    'AI bodybuilding coach',
    'gym workout plan',
    'home workout',
    'Egyptian meal plan',
    'calorie calculator',
    'fitness AI',
  ];

  const keywords = isAr ? [...keywordsAr, ...keywordsEn] : [...keywordsEn, ...keywordsAr];

  // Google Search Console verification - ضع القيمة في Vercel env: GOOGLE_SITE_VERIFICATION
  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

  return {
    title: { default: title, template: `%s | ATLAS` },
    description,
    keywords,
    authors: [{ name: 'ABDALLAH SHENOO', url: 'https://atlasfit.pro' }],
    creator: 'ABDALLAH SHENOO',
    publisher: 'ATLAS AI Coach',
    category: 'fitness',
    classification: 'Health & Fitness',
    metadataBase: new URL('https://atlasfit.pro'),
    alternates: {
      canonical: canonicalPath,
      languages: { ar: '/', en: '/en', 'x-default': '/' },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'ATLAS AI Coach',
      locale: isAr ? 'ar_EG' : 'en_US',
      alternateLocale: isAr ? ['en_US'] : ['ar_EG'],
      url: canonicalPath,
      title,
      description,
      images: [
        {
          url: '/icons/icon-512x512.png',
          width: 512,
          height: 512,
          alt: 'ATLAS AI Coach - مدرب كمال أجسام ذكي',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/icons/icon-512x512.png'],
      creator: '@atlasfit',
    },
    manifest: '/manifest.json',
    ...(googleVerification
      ? { verification: { google: googleVerification } }
      : {}),
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'ATLAS',
    },
    icons: {
      icon: [
        { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [{ url: '/icons/icon-192x192.png', sizes: '192x192' }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#a3e635" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-ironforge-background text-ironforge-text antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen">
            <Navigation />
            <main className="flex-1 w-full pb-24 md:pb-0 md:min-h-screen overflow-x-hidden">
              {children}
            </main>
          </div>
          <UpdateChecker />
          <PresenceTracker />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
