import { validateWithI18nAsync } from "@/core/domain/validation/validator";
import { signInSchema } from "@/features/auth/domain/validation/auth-schema";

import type {
  Session,
  SignInCredentials,
} from "@/features/auth/domain/entities/session";
import type { AuthRepository } from "@/features/auth/domain/repositories/auth-repository";

export const signIn =
  (repository: AuthRepository) =>
  async (credentials: SignInCredentials): Promise<Session> => {
    const validatedCredentials = await validateWithI18nAsync(
      signInSchema,
      credentials,
    );
    return repository.signIn(validatedCredentials);
  };
