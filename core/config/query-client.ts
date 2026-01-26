import { QueryClient } from '@tanstack/react-query';

import { AppError } from '@/core/domain/errors/app-error';

const STALE_TIME_MS = 5 * 60 * 1000;
const GARBAGE_COLLECTION_TIME_MS = 10 * 60 * 1000;
const MAX_RETRY_COUNT = 3;
const NON_RETRYABLE_ERROR_CODES = ['PGRST116', '42501'];

function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (
    AppError.hasCode(error) &&
    NON_RETRYABLE_ERROR_CODES.includes(error.code)
  ) {
    return false;
  }
  return failureCount < MAX_RETRY_COUNT;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
      gcTime: GARBAGE_COLLECTION_TIME_MS,
      retry: shouldRetryQuery,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
