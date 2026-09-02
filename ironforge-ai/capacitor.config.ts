import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.atlas.ai',
  appName: 'ATLAS',
  webDir: 'out',
  // لو هتشغل APK وهو بيكلم سيرفر محلي/مستضاف — استخدم server.url
  // للـ APK الأوفلاين الكامل لازم تعمل next build + next export (out)
  server: {
    // للتطوير: يشغل الويب فيو على السيرفر المحلي
    // url: 'http://10.0.2.2:3000',
    // androidScheme: 'https',
    // cleartext: true,
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
