import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ecolista.mobile',
  appName: 'EcoLista',
  webDir: 'www',
  android: {
    minVersion: '24',
    allowMixedContent: false,
  },
  ios: {
    minVersion: '13.0',
  },
  server: {
    cleartext: false,
  },
};

export default config;
