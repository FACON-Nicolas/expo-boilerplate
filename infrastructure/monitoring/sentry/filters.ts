import type { EventHint } from '@sentry/core';
import type { ErrorEvent } from '@sentry/react-native';

const IGNORED_ERROR_MESSAGES = [
  'Network request failed',
  'Failed to fetch',
  'cancelled',
  'timeout',
  'ECONNREFUSED',
  'AbortError',
  'TimeoutError',
  'The operation was aborted',
  'The request was aborted',
  'Request aborted',
];

const IGNORED_ERROR_TYPES = ['AbortError', 'TimeoutError'];

function isIgnoredErrorMessage(message: string | undefined): boolean {
  if (!message) return false;
  return IGNORED_ERROR_MESSAGES.some((ignored) =>
    message.toLowerCase().includes(ignored.toLowerCase()),
  );
}

function isIgnoredErrorType(error: unknown): boolean {
  if (error instanceof Error) {
    return IGNORED_ERROR_TYPES.includes(error.name);
  }
  return false;
}

function isUserAbortError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  return error.name === 'AbortError';
}

export function createBeforeSendFilter(): (
  event: ErrorEvent,
  hint: EventHint,
) => ErrorEvent | null {
  return (event: ErrorEvent, hint: EventHint): ErrorEvent | null => {
    const error = hint.originalException;

    if (isUserAbortError(error)) {
      return null;
    }

    if (isIgnoredErrorType(error)) {
      return null;
    }

    const errorMessage =
      error instanceof Error ? error.message : String(error);

    if (isIgnoredErrorMessage(errorMessage)) {
      return null;
    }

    if (event.message && isIgnoredErrorMessage(event.message)) {
      return null;
    }

    return event;
  };
}
