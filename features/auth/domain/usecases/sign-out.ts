import type { AuthRepository } from '../repositories/auth-repository';

export const signOut = (repository: AuthRepository) => async (): Promise<void> => {
  return repository.signOut();
};
