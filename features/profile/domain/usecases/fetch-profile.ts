import type { Profile } from '@/features/profile/domain/entities/profile';
import type { ProfileRepository } from '@/features/profile/domain/repositories/profile-repository';

export const fetchProfile =
  (repository: ProfileRepository) =>
  async (): Promise<Profile> => {
    return repository.getProfile();
  };
