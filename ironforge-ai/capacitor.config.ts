import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.atlas.ai',
  appName: 'ATLAS',
  webDir: 'out',
  // التحديث الفوري: التطبيق يحمّل من Vercel - أي git push يظهر فوراً بدون APK جديد
  server: {
    url: 'https://atlas2-nxzzu5ikw-abdalahana62-eng.vercel.app',
    androidScheme: 'https',
    cleartext: true,
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
