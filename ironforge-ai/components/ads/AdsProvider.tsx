'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  isNativePlatform,
  prepareInterstitialAd,
  showBannerAd,
  showInterstitialAd,
} from '@/lib/ads';

// Banner دائم + Interstitial عند التنقل الطبيعي (بحد أقصى و Cooldown 90 ثانية).
// يعمل فقط على APK/IPA الأصلي — على الويب لا يفعل شيئاً.
export default function AdsProvider() {
  const pathname = usePathname();

  // init مرة واحدة: بانر + تجهيز أول interstitial + مستمع لحدث يدوي
  useEffect(() => {
    if (!isNativePlatform()) return;
    let mounted = true;
    (async () => {
      await showBannerAd();
      if (mounted) await prepareInterstitialAd();
    })();

    const onManual = () => { showInterstitialAd(); };
    window.addEventListener('atlas:interstitial', onManual);
    return () => {
      window.removeEventListener('atlas:interstitial', onManual);
    };
  }, []);

  // اعرض interstitial كل ~4 تنقلات كحد أقصى (فاصل طبيعي بين الصفحات)
  useEffect(() => {
    if (!isNativePlatform()) return;
    try {
      const n = Number(sessionStorage.getItem('atlas-nav-count') || '0') + 1;
      sessionStorage.setItem('atlas-nav-count', String(n));
      if (n >= 4) {
        sessionStorage.setItem('atlas-nav-count', '0');
        showInterstitialAd();
      }
    } catch { /* ignore */ }
  }, [pathname]);

  return null;
}
