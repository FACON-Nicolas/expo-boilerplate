import { SignInUser, SignUpUser } from '@/types/user';
import supabase from './supabase';
import { AuthResponse } from '@supabase/supabase-js';
import { loginSchema, signUpSchema } from '@/validation/auth';

export const signInFromSupabase = async ({
  email,
  password,
}: SignInUser): Promise<AuthResponse['data']> => {
  const loginValidation = loginSchema.safeParse({ email, password });
  if (loginValidation.error) {
    return Promise.reject(loginValidation.error.issues[0]);
  }

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
  const signUpValidation = signUpSchema.safeParse({
    email,
    password,
    passwordConfirmation,
  });
  if (signUpValidation.error) {
    return Promise.reject(signUpValidation.error.issues[0]);
  }

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
