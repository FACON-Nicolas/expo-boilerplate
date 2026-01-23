import { validateWithI18nAsync } from '@/core/domain/validation/validator';
import { signUpSchema } from '@/features/auth/domain/validation/auth-schema';

import type { Session, SignUpCredentials } from '@/features/auth/domain/entities/session';
import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository';


export const signUp =
  (repository: AuthRepository) =>
  async (credentials: SignUpCredentials): Promise<Session> => {
    const validatedCredentials = await validateWithI18nAsync(signUpSchema, credentials);
    return repository.signUp(validatedCredentials);
  };
