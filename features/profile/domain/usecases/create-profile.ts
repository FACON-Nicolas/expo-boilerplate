import type { ProfileRepository } from '../repositories/profile-repository';
import type { Profile, CreateProfileInput } from '../entities/profile';
import { createProfileSchema } from '../validation/profile-schema';
import { validateWithI18nAsync } from '@/core/data/validation/validator';

export const createProfile =
  (repository: ProfileRepository) =>
  async (data: CreateProfileInput, userId: string): Promise<Profile> => {
    await validateWithI18nAsync(createProfileSchema.innerType(), data);
    return repository.createProfile(data, userId);
  };
