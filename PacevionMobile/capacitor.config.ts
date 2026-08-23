import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pacevion.app',
  appName: 'Pacevion',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#0a0a0f',
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a0a0f',
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_pacevion',
      iconColor: '#ff1801',
    },
  },
};

export default config;
