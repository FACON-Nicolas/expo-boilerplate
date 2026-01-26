import type { ProfileRepository } from '@/features/profile/domain/repositories/profile-repository';

let repository: ProfileRepository | null = null;

export const initializeProfileRepository = (repo: ProfileRepository): void => {
  repository = repo;
};

export const getProfileRepository = (): ProfileRepository => {
  if (!repository) {
    throw new Error('Profile repository not initialized. Call initializeProfileRepository first.');
  }
  return repository;
};
