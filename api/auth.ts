import { SignInUser, SignUpUser } from '@/types/user';
import supabase from './supabase';
import { AuthResponse, Session } from '@supabase/supabase-js';
import { loginSchema, signUpSchema } from '@/validation/auth';
import { validateWithI18nAsync } from '@/utils/validator';
import i18n from '@/i18n';

export const signInFromSupabase = async ({
  email,
  password,
}: SignInUser): Promise<AuthResponse['data']> => {
  const signInUserValidated = await validateWithI18nAsync<SignInUser>(
    i18n.t,
    loginSchema,
    {
      email,
      password,
    }
  );

  try {
    const { data, error } = await supabase.auth.signInWithPassword(
      signInUserValidated
    );

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
  await validateWithI18nAsync<SignUpUser>(i18n.t, signUpSchema, {
    email,
    password,
    passwordConfirmation,
  });

  try {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return Promise.reject(error);
    }

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const refreshSessionFromSupabase = async (): Promise<Session> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      return Promise.reject(error);
    }

    if (!data.session) {
      return Promise.reject(new Error('No session found'));
    }

    return Promise.resolve(data.session);
  } catch (error) {
    await signOutFromSupabase();
    return Promise.reject(error);
  }
};

export const signOutFromSupabase = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return Promise.reject(error);
    }

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const setSessionFromSupabase = async (session: Session) => {
  try {
    const { error } = await supabase.auth.setSession(session);
    if (error) {
      return Promise.reject(error);
    }
    return Promise.resolve(session);
  } catch (error) {
    return Promise.reject(error);
  }
};
