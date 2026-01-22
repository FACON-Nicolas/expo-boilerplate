import type { ProfileRepository } from '../repositories/profile-repository';
import type { Profile } from '../entities/profile';

export const fetchProfile =
  (repository: ProfileRepository) =>
  async (): Promise<Profile> => {
    return repository.getProfile();
  };
