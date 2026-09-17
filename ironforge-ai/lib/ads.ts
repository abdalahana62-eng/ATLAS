'use client';

import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  AdmobConsentStatus,
  BannerAdPosition,
  BannerAdSize,
} from '@capacitor-community/admob';

// IDs التجريبية الرسمية من Google — آمنة للتطوير قبل الرفع على Play.
// https://developers.google.com/admob/android/test-ads
// عند الاستلام الحقيقي: ضع القيم في .env.local بـ NEXT_PUBLIC_ADMOB_* واعمل rebuild.
const TEST_IDS = {
  android: {
    appId: 'ca-app-pub-3940256099942544~3347511713',
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
  },
  ios: {
    appId: 'ca-app-pub-3940256099942544~1458002511',
    banner: 'ca-app-pub-3940256099942544/2934735716',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
  },
};

function pick(env: string | undefined, test: string) {
  // أي قيمة حقيقية تبدأ بـ ca-app-pub- ومش رقم 3940256099942544 تعتبر production
  if (env && env.startsWith('ca-app-pub-') && !env.includes('3940256099942544')) return env;
  return test;
}

export function isNativePlatform() {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export function getAdIds() {
  const platform = Capacitor.getPlatform();
  const fallback = platform === 'ios' ? TEST_IDS.ios : TEST_IDS.android;
  return {
    banner: pick(process.env.NEXT_PUBLIC_ADMOB_BANNER, fallback.banner),
    interstitial: pick(process.env.NEXT_PUBLIC_ADMOB_INTERSTITIAL, fallback.interstitial),
    isTest: (() => {
      const raw = platform === 'ios'
        ? process.env.NEXT_PUBLIC_ADMOB_BANNER
        : process.env.NEXT_PUBLIC_ADMOB_BANNER;
      return !raw || raw.includes('3940256099942544');
    })(),
  };
}

let initPromise: Promise<boolean> | null = null;

export function initializeAds(): Promise<boolean> {
  if (!isNativePlatform()) return Promise.resolve(false);
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await AdMob.initialize();
      try {
        let consent = await AdMob.requestConsentInfo();
        if (consent.isConsentFormAvailable && consent.status === AdmobConsentStatus.REQUIRED) {
          consent = await AdMob.showConsentForm();
        }
        if (!consent.canRequestAds) return false;
      } catch {
        // أجهزة بدون UMP (معظم مصر) — كمّل عادي
      }
      return true;
    } catch (e) {
      console.warn('[ads] initialize failed', e);
      return false;
    }
  })();
  return initPromise;
}

export async function showBannerAd() {
  if (!isNativePlatform()) return;
  const canShow = await initializeAds();
  if (!canShow) return;
  const { banner } = getAdIds();
  try {
    await AdMob.showBanner({
      adId: banner,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: getAdIds().isTest,
    });
    // ارفع محتوى الويب فوق البانر الأصلي عشان ما يغطيش زراير التنقل
    document.documentElement.style.setProperty('--atlas-ad-banner-offset', '64px');
    document.body.classList.add('atlas-ads-banner-visible');
  } catch (e) {
    console.warn('[ads] showBanner failed', e);
  }
}

export async function hideBannerAd() {
  try {
    await AdMob.hideBanner();
  } catch { /* ignore */ }
}

export async function removeBannerAd() {
  try {
    await AdMob.removeBanner();
  } catch { /* ignore */ }
  document.body.classList.remove('atlas-ads-banner-visible');
}

// --- Interstitial مع Cooldown عشان مخالفش سياسة AdMob ---
let interstitialReady = false;
let lastInterstitialAt = 0;
const INTERSTITIAL_COOLDOWN_MS = 90_000;

export async function prepareInterstitialAd() {
  if (!isNativePlatform()) return;
  const canShow = await initializeAds();
  if (!canShow) return;
  const { interstitial } = getAdIds();
  try {
    await AdMob.prepareInterstitial({
      adId: interstitial,
      isTesting: getAdIds().isTest,
    });
    interstitialReady = true;
  } catch (e) {
    console.warn('[ads] prepareInterstitial failed', e);
    interstitialReady = false;
  }
}

export async function showInterstitialAd(opts?: { force?: boolean }): Promise<boolean> {
  if (!isNativePlatform()) return false;
  const now = Date.now();
  if (!opts?.force && now - lastInterstitialAt < INTERSTITIAL_COOLDOWN_MS) return false;
  try {
    await AdMob.showInterstitial();
    lastInterstitialAt = now;
    interstitialReady = false;
    // جهّز اللي بعده مباشرة
    setTimeout(() => { prepareInterstitialAd(); }, 2000);
    return true;
  } catch {
    // لو العرض فشل (مش متحمل) جهّز واحد جديد
    interstitialReady = false;
    prepareInterstitialAd();
    return false;
  }
}

export function isInterstitialReady() {
  return interstitialReady;
}

// حدث عام: أي صفحة تقدر تنادي window.dispatchEvent(new Event('atlas:interstitial'))
// أو استيراد showInterstitialAd مباشرة بعد حدث طبيعي (نهاية تمرين، حفظ وجبة...).
