import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.atlas.ai',
  appName: 'ATLAS',
  webDir: 'out',
  // أوفلاين + فحص تحديث عند وجود نت
  server: {
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
