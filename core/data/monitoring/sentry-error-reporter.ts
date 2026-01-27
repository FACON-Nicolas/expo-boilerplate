import * as Sentry from '@sentry/react-native';

import { APP_ERROR_SEVERITY_MAP } from '@/core/data/monitoring/sentry-types';
import { AppError } from '@/core/domain/errors/app-error';

export type ErrorContext = {
  tags?: Record<string, string>;
  extras?: Record<string, unknown>;
};

export function captureAppError(
  error: AppError,
  context?: ErrorContext,
): void {
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

export function captureError(
  error: unknown,
  context?: ErrorContext,
): void {
  if (error instanceof AppError) {
    captureAppError(error, context);
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
