import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  EXPO_PUBLIC_SUPABASE_EMAIL_LOGIN_DEV: z.string().email().optional(),
  EXPO_PUBLIC_SUPABASE_PASSWORD_LOGIN_DEV: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse({
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    EXPO_PUBLIC_SUPABASE_EMAIL_LOGIN_DEV:
      process.env.EXPO_PUBLIC_SUPABASE_EMAIL_LOGIN_DEV,
    EXPO_PUBLIC_SUPABASE_PASSWORD_LOGIN_DEV:
      process.env.EXPO_PUBLIC_SUPABASE_PASSWORD_LOGIN_DEV,
  });

  if (!result.success) {
    const missingVars = result.error.issues
      .map((issue) => issue.path.join('.'))
      .join(', ');
    throw new Error(`Missing or invalid environment variables: ${missingVars}`);
  }

  return result.data;
}

export const env = validateEnv();
