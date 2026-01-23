import { validateWithI18nAsync } from '@/core/domain/validation/validator';
import { createProfileSchema } from '@/features/profile/domain/validation/profile-schema';

import type { Profile, CreateProfileInput } from '@/features/profile/domain/entities/profile';
import type { ProfileRepository } from '@/features/profile/domain/repositories/profile-repository';


export const createProfile =
  (repository: ProfileRepository) =>
  async (data: CreateProfileInput, userId: string): Promise<Profile> => {
    await validateWithI18nAsync(createProfileSchema.innerType(), data);
    return repository.createProfile(data, userId);
  };
