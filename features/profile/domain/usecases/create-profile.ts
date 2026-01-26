import { validateWithI18nAsync } from "@/core/domain/validation/validator";
import { createProfileSchema } from "@/features/profile/domain/validation/profile-schema";

import type { Profile } from "@/features/profile/domain/entities/profile";
import type { ProfileRepository } from "@/features/profile/domain/repositories/profile-repository";
import type { CreateProfileInput } from "@/features/profile/domain/validation/profile-schema";

export const createProfile =
  (repository: ProfileRepository) =>
  async (data: CreateProfileInput, userId: string): Promise<Profile> => {
    const validatedData = await validateWithI18nAsync(createProfileSchema, data);
    return repository.createProfile(validatedData, userId);
  };
