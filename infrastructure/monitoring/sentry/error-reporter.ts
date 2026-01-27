import { env } from '@/core/config/env';
import { captureError } from '@/core/data/monitoring/sentry-error-reporter';

import type { ErrorContext } from '@/core/data/monitoring/sentry-error-reporter';

export function isSentryEnabled(): boolean {
  return !!env.EXPO_PUBLIC_SENTRY_ENABLED && !!env.EXPO_PUBLIC_SENTRY_DSN;
}

export function reportErrorToSentry(
  error: unknown,
  context?: ErrorContext,
): void {
  if (!isSentryEnabled()) return;
  captureError(error, context);
}
