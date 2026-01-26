import { createClient } from '@supabase/supabase-js';

import { env } from '@/core/config/env';

export const supabaseClient = createClient(
  env.EXPO_PUBLIC_SUPABASE_URL,
  env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
  },
);
