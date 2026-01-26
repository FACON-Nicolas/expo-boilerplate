import { AppError } from '@/core/domain/errors/app-error';
import { profileSchema } from '@/features/profile/domain/validation/profile-schema';

import type { Profile } from '@/features/profile/domain/entities/profile';
import type { ProfileRepository } from '@/features/profile/domain/repositories/profile-repository';
import type { CreateProfileOutput, UpdateProfileOutput } from '@/features/profile/domain/validation/profile-schema';
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

  createProfile: async (profileData: CreateProfileOutput, userId: string): Promise<Profile> => {
    const { data, error } = await client
      .from('profiles')
      .insert([{ ...profileData, user_id: userId }])
      .select()
      .single();

    if (error) {
      throw AppError.fromUnknown(error);
    }

    return profileSchema.parse(data);
  },

  updateProfile: async (profileData: UpdateProfileOutput): Promise<Profile> => {
    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) {
      throw AppError.unauthorized('No authenticated user found');
    }

    const { data, error } = await client
      .from('profiles')
      .update(profileData)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw AppError.fromUnknown(error);
    }

    return profileSchema.parse(data);
  },
});
