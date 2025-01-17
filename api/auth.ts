import { SignInUser, SignUpUser } from '@/types/user';
import supabase from './supabase';
import { AuthResponse } from '@supabase/supabase-js';

export const signInFromSupabase = async ({
  email,
  password,
}: SignInUser): Promise<AuthResponse['data']> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return Promise.reject(error);
    }

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const signUpFromSupabase = async ({
  email,
  password,
  passwordConfirmation,
}: SignUpUser): Promise<AuthResponse['data']> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return Promise.reject(error);
    }

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};
