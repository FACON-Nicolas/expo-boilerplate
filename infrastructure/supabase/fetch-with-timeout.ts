import { SupabaseNetworkError, SupabaseTimeoutError } from '@/infrastructure/supabase/errors';

const REQUEST_TIMEOUT_MS = 10000;

export const fetchWithTimeout = async (
  url: RequestInfo | URL,
  options?: RequestInit
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new SupabaseTimeoutError();
    }
    throw new SupabaseNetworkError('Supabase request failed', error);
  } finally {
    clearTimeout(timeoutId);
  }
};
