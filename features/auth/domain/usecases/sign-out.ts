import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository';

export const signOut = (repository: AuthRepository) => async (): Promise<void> => {
  return repository.signOut();
};
