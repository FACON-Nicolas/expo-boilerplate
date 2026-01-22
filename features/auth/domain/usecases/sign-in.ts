import type { AuthRepository } from '../repositories/auth-repository';
import type { Session, SignInCredentials } from '../entities/session';
import { signInSchema } from '../validation/auth-schema';
import { validateWithI18nAsync } from '@/core/data/validation/validator';

export const signIn =
  (repository: AuthRepository) =>
  async (credentials: SignInCredentials): Promise<Session> => {
    const validatedCredentials = await validateWithI18nAsync(signInSchema, credentials);
    return repository.signIn(validatedCredentials);
  };
