import type { Profile, CreateProfileInput, UpdateProfileInput } from '@/features/profile/domain/entities/profile';

export type ProfileRepository = {
  getProfile: () => Promise<Profile>;
  createProfile: (data: CreateProfileInput, userId: string) => Promise<Profile>;
  updateProfile: (data: UpdateProfileInput) => Promise<Profile>;
};
