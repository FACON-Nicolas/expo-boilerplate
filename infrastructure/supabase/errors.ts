export class SupabaseTimeoutError extends Error {
  constructor(message: string = 'Supabase request timed out') {
    super(message);
    this.name = 'SupabaseTimeoutError';
  }
}

export class SupabaseNetworkError extends Error {
  constructor(message: string = 'Supabase request failed', cause?: unknown) {
    super(message, { cause });
    this.name = 'SupabaseNetworkError';
  }
}
