'use client';

import { useTranslations, useLocale as useNextIntlLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

export type Locale = (typeof routing.locales)[number];

export interface UseLocaleReturn {
  t: ReturnType<typeof useTranslations>;
  locale: Locale;
  locales: Locale[];
  isRTL: boolean;
  toggleLocale: () => void;
  getLocalizedValue: <T>(value: { en: T; ar: T }) => T;
}

export function useLocale(namespace?: string): UseLocaleReturn {
  const t = useTranslations(namespace);
  const locale = useNextIntlLocale() as Locale;
  const locales = [...routing.locales] as Locale[];

  const isRTL = locale === 'ar';

  const toggleLocale = () => {
    const nextLocale = locales.find((l) => l !== locale) || locales[0];
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const segments = currentPath.split('/');
      const currentLocaleInPath = routing.locales.includes(
        segments[1] as Locale
      );
      if (currentLocaleInPath) {
        segments[1] = nextLocale;
      } else {
        segments.splice(1, 0, nextLocale);
      }
      window.location.href = segments.join('/');
    }
  };

  const getLocalizedValue = <T>(value: { en: T; ar: T }): T => {
    return value[locale] || value.en;
  };

  return {
    t,
    locale,
    locales,
    isRTL,
    toggleLocale,
    getLocalizedValue
  };
}

export default useLocale;
