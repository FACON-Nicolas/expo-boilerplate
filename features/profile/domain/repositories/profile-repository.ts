import type { Profile, CreateProfileInput, UpdateProfileInput } from '../entities/profile';

export type ProfileRepository = {
  getProfile: () => Promise<Profile>;
  createProfile: (data: CreateProfileInput, userId: string) => Promise<Profile>;
  updateProfile: (data: UpdateProfileInput) => Promise<Profile>;
};
