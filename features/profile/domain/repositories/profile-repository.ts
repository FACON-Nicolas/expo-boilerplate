import type { Profile } from '@/features/profile/domain/entities/profile';
import type { CreateProfileOutput, UpdateProfileOutput } from '@/features/profile/domain/validation/profile-schema';

export type ProfileRepository = {
  getProfile: () => Promise<Profile>;
  createProfile: (data: CreateProfileOutput, userId: string) => Promise<Profile>;
  updateProfile: (data: UpdateProfileOutput) => Promise<Profile>;
};
