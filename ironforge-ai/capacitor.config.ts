import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.atlas.ai',
  appName: 'ATLAS',
  webDir: 'out',
  // أوفلاين + فحص تحديث عند وجود نت
  // SECURITY: cleartext=false لمنع HTTP المكشوف (MITM). كل API عبر HTTPS فقط.
  server: {
    androidScheme: 'https',
    cleartext: false,
    allowNavigation: ['atlasfit.pro', '*.vercel.app'],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#0a0a0a',
    },
  },
  android: {
    backgroundColor: '#0a0a0a',
  },
};

export default config;
