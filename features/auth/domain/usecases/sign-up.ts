import type { AuthRepository } from '../repositories/auth-repository';
import type { Session, SignUpCredentials } from '../entities/session';
import { signUpSchema } from '../validation/auth-schema';
import { validateWithI18nAsync } from '@/core/data/validation/validator';

export const signUp =
  (repository: AuthRepository) =>
  async (credentials: SignUpCredentials): Promise<Session> => {
    const validatedCredentials = await validateWithI18nAsync(signUpSchema, credentials);
    return repository.signUp(validatedCredentials);
  };
