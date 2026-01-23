import { AppError } from '@/core/domain/errors/app-error';
import { validateWithI18nAsync } from '@/core/domain/validation/validator';
import { profileSchema, createProfileSchema, updateProfileSchema } from '@/features/profile/domain/validation/profile-schema';

import type { Profile, CreateProfileInput, UpdateProfileInput } from '@/features/profile/domain/entities/profile';
import type { ProfileRepository } from '@/features/profile/domain/repositories/profile-repository';
import type { SupabaseClient } from '@supabase/supabase-js';



export const createSupabaseProfileRepository = (client: SupabaseClient): ProfileRepository => ({
  getProfile: async (): Promise<Profile> => {
    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) {
      throw AppError.unauthorized('No authenticated user found');
    }

    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      throw AppError.fromUnknown(error);
    }

    return profileSchema.parse(data);
  },

  createProfile: async (profileData: CreateProfileInput, userId: string): Promise<Profile> => {
    const validatedProfile = await validateWithI18nAsync(createProfileSchema, profileData);

    const { data, error } = await client
      .from('profiles')
      .insert([{ ...validatedProfile, user_id: userId }])
      .select()
      .single();

    if (error) {
      throw AppError.fromUnknown(error);
    }

    return profileSchema.parse(data);
  },

  updateProfile: async (profileData: UpdateProfileInput): Promise<Profile> => {
    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) {
      throw AppError.unauthorized('No authenticated user found');
    }

    const validatedProfile = await validateWithI18nAsync(updateProfileSchema, profileData);

    const { data, error } = await client
      .from('profiles')
      .update(validatedProfile)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw AppError.fromUnknown(error);
    }

    return profileSchema.parse(data);
  },
});
