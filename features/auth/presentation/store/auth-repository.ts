import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository';

let repository: AuthRepository | null = null;

export const initializeAuthRepository = (repo: AuthRepository): void => {
  repository = repo;
};

export const getAuthRepository = (): AuthRepository => {
  if (!repository) {
    throw new Error('Auth repository not initialized. Call initializeAuthRepository first.');
  }
  return repository;
};
