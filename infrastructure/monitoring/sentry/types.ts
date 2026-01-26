import type { AppErrorCode } from '@/core/domain/errors/app-error';
import type { SeverityLevel } from '@sentry/react-native';

export type SentryUser = {
  id: string;
  email?: string;
  username?: string;
};

export type SentryBreadcrumb = {
  category: string;
  message: string;
  level: SeverityLevel;
  data?: Record<string, unknown>;
};

export const APP_ERROR_SEVERITY_MAP: Record<AppErrorCode, SeverityLevel> = {
  UNKNOWN: 'error',
  VALIDATION: 'warning',
  NETWORK: 'warning',
  UNAUTHORIZED: 'info',
  NOT_FOUND: 'info',
  CONFLICT: 'warning',
};
