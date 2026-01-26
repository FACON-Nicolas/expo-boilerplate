import { AppError } from '@/core/domain/errors/app-error';

import type { Session, SignInCredentials, SignUpCredentials, User } from '@/features/auth/domain/entities/session';
import type { AuthRepository, AuthStateCallback, Unsubscribe } from '@/features/auth/domain/repositories/auth-repository';
import type { SupabaseClient, Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js';


const mapSupabaseUser = (user: SupabaseUser): User => ({
  id: user.id,
  email: user.email ?? '',
});

const mapSupabaseSession = (session: SupabaseSession): Session => ({
  accessToken: session.access_token,
  refreshToken: session.refresh_token,
  expiresAt: session.expires_at,
  user: mapSupabaseUser(session.user),
});

export const createSupabaseAuthRepository = (client: SupabaseClient): AuthRepository => ({
  signIn: async (credentials: SignInCredentials): Promise<Session> => {
    const { data, error } = await client.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw AppError.unauthorized(error.message);
    }

    if (!data.session) {
      throw AppError.unauthorized('No session returned');
    }

    return mapSupabaseSession(data.session);
  },

  signUp: async (credentials: SignUpCredentials): Promise<Session> => {
    const { data, error } = await client.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw AppError.unauthorized(error.message);
    }

    if (!data.session) {
      throw AppError.unauthorized('No session returned');
    }

    return mapSupabaseSession(data.session);
  },

  signOut: async (): Promise<void> => {
    const { error } = await client.auth.signOut();

    if (error) {
      throw AppError.fromUnknown(error);
    }
  },

  refreshSession: async (): Promise<Session> => {
    const { data, error } = await client.auth.refreshSession();

    if (error) {
      throw AppError.unauthorized(error.message);
    }

    if (!data.session) {
      throw AppError.unauthorized('No session found');
    }

    return mapSupabaseSession(data.session);
  },

  setSession: async (session: Session): Promise<Session> => {
    const { error } = await client.auth.setSession({
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
    });

    if (error) {
      throw AppError.unauthorized(error.message);
    }

    return session;
  },

  getSession: async (): Promise<Session | null> => {
    const { data, error } = await client.auth.getSession();

    if (error || !data.session) {
      return null;
    }

    return mapSupabaseSession(data.session);
  },

  subscribeToAuthChanges: (callback: AuthStateCallback): Unsubscribe => {
    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
          if (session) {
            callback(mapSupabaseSession(session));
          }
          break;
        case 'SIGNED_OUT':
          callback(null);
          break;
      }
    });

    return () => subscription.unsubscribe();
  },
});
