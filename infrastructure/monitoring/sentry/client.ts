import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';

import { env } from '@/core/config/env';
import { createBeforeSendFilter } from '@/infrastructure/monitoring/sentry/filters';

export const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

export function initializeSentry(): void {
  if (!env.EXPO_PUBLIC_SENTRY_ENABLED || !env.EXPO_PUBLIC_SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: env.EXPO_PUBLIC_SENTRY_DSN,
    environment: __DEV__ ? 'development' : 'production',
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    integrations: [
      navigationIntegration,
      Sentry.mobileReplayIntegration({
        maskAllText: true,
        maskAllImages: true,
      }),
    ],
    enableNativeFramesTracking: !isRunningInExpoGo(),
    beforeSend: createBeforeSendFilter(),
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
