import { InjectionToken } from '@angular/core';
import { Capacitor } from '@capacitor/core';

export type PlatformTarget = 'android' | 'ios' | 'webmobile';

export interface PlatformPackaging {
  readonly unsignedApkTask: string;
  readonly appBundleTask: string;
  readonly outputDirectory: string;
}

export interface PlatformConfig {
  readonly platform: PlatformTarget;
  readonly ionicConfig: Record<string, any>; // ← reemplazo seguro
  readonly minSdkVersion: number;
  readonly targetSdkVersion: number;
  readonly packageId: string;
  readonly appName: string;
  readonly developerEmail: string;
  readonly packaging: PlatformPackaging;
  readonly notes: string;
}

export const PLATFORM_CONFIG_TOKEN = new InjectionToken<PlatformConfig>('PLATFORM_CONFIG');

const PLATFORM_CONFIGS: Record<PlatformTarget, PlatformConfig> = {
  android: {
    platform: 'android',
    ionicConfig: {
      mode: 'md',
      backButtonText: 'Atrás',
      animated: true,
    },
    minSdkVersion: 24,
    targetSdkVersion: 34,
    packageId: 'com.ecolista.mobile',
    appName: 'EcoLista',
    developerEmail: 'publicaciones@ecolista.app',
    packaging: {
      unsignedApkTask: 'assembleRelease',
      appBundleTask: 'bundleRelease',
      outputDirectory: 'android/app/build/outputs',
    },
    notes: 'Build de producción optimizado para Google Play.',
  },

  ios: {
    platform: 'ios',
    ionicConfig: {
      mode: 'ios',
      backButtonText: 'Atrás',
      animated: true,
    },
    minSdkVersion: 13,
    targetSdkVersion: 18,
    packageId: 'com.ecolista.mobile',
    appName: 'EcoLista',
    developerEmail: 'publicaciones@ecolista.app',
    packaging: {
      unsignedApkTask: 'archive',
      appBundleTask: 'archive',
      outputDirectory: 'ios/App/App.xcarchive',
    },
    notes: 'Build para App Store (Xcode & Transporter).',
  },

  webmobile: {
    platform: 'webmobile',
    ionicConfig: {
      mode: 'md',
      rippleEffect: true,
      animated: true,
    },
    minSdkVersion: 0,
    targetSdkVersion: 0,
    packageId: 'com.ecolista.web',
    appName: 'EcoLista Web',
    developerEmail: 'publicaciones@ecolista.app',
    packaging: {
      unsignedApkTask: 'ng build --configuration production',
      appBundleTask: 'ng build --configuration production',
      outputDirectory: 'www',
    },
    notes: 'Distribución PWA lista para hosting estático.',
  },
};

export function resolvePlatformTarget(): PlatformTarget {
  const platform = Capacitor.getPlatform();

  if (platform === 'android') return 'android';
  if (platform === 'ios') return 'ios';

  return 'webmobile';
}

export function resolvePlatformConfig(): PlatformConfig {
  return PLATFORM_CONFIGS[resolvePlatformTarget()];
}
