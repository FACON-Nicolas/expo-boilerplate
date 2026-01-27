import { createClient } from '@supabase/supabase-js';

import { env } from '@/core/config/env';
import { fetchWithTimeout } from '@/infrastructure/supabase/fetch-with-timeout';

export const supabaseClient = createClient(
  env.EXPO_PUBLIC_SUPABASE_URL,
  env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
    global: {
      fetch: fetchWithTimeout,
    },
  },
);
