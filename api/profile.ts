import { CreateProfile, Profile, UpdateProfile } from '@/types/profile';
import supabase from '@/api/supabase';
import {
  createProfileSchema,
  profileSchema,
  updateProfileSchema,
} from '@/validation/profile';
import { validateWithI18nAsync } from '@/utils/validator';

export const createProfileFromSupabase = async (
  profileData: CreateProfile,
  userId: string
): Promise<Profile> => {
  const validatedProfile = await validateWithI18nAsync<CreateProfile>(
    createProfileSchema,
    profileData
  );

  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ ...validatedProfile, user_id: userId }])
      .select()
      .single();

    if (error) {
      return Promise.reject(error);
    }

    const profile: Profile = profileSchema.parse(data);
    return Promise.resolve(profile);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getProfileFromSupabase = async (): Promise<Profile> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .single();

    if (error) {
      return Promise.reject(error);
    }

    const profile: Profile = profileSchema.parse(data);
    return Promise.resolve(profile);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateProfileFromSupabase = async (
  profileData: UpdateProfile
): Promise<Profile> => {
  const validatedProfile = await validateWithI18nAsync<UpdateProfile>(
    updateProfileSchema,
    profileData
  );

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(validatedProfile)
      .select()
      .single();

    if (error) {
      return Promise.reject(error);
    }

    const profile: Profile = profileSchema.parse(data);
    return Promise.resolve(profile);
  } catch (error) {
    return Promise.reject(error);
  }
};
