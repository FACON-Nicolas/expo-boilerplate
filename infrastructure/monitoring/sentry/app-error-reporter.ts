import * as Sentry from '@sentry/react-native';

import { env } from '@/core/config/env';
import { AppError } from '@/core/domain/errors/app-error';
import { APP_ERROR_SEVERITY_MAP } from '@/infrastructure/monitoring/sentry/types';

type ErrorContext = {
  tags?: Record<string, string>;
  extras?: Record<string, unknown>;
};

export function reportAppErrorToSentry(
  error: AppError,
  context?: ErrorContext,
): void {
  if (!env.EXPO_PUBLIC_SENTRY_ENABLED || !env.EXPO_PUBLIC_SENTRY_DSN) {
    return;
  }

  const severity = APP_ERROR_SEVERITY_MAP[error.code];

  Sentry.withScope((scope) => {
    scope.setLevel(severity);
    scope.setTag('app_error_code', error.code);

    if (error.originalError) {
      scope.setExtra('original_error', error.originalError);
    }

    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extras) {
      Object.entries(context.extras).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    Sentry.captureException(error);
  });
}

export function reportErrorToSentry(
  error: unknown,
  context?: ErrorContext,
): void {
  if (!env.EXPO_PUBLIC_SENTRY_ENABLED || !env.EXPO_PUBLIC_SENTRY_DSN) {
    return;
  }

  if (error instanceof AppError) {
    reportAppErrorToSentry(error, context);
    return;
  }

  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extras) {
      Object.entries(context.extras).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    Sentry.captureException(error);
  });
}
