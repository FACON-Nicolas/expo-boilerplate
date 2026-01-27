import { AppError } from "@/core/domain/errors/app-error";
import {
  SupabaseNetworkError,
  SupabaseTimeoutError,
} from "@/infrastructure/supabase/errors";

import type {
  Session,
  SignInCredentials,
  SignUpCredentials,
  User,
} from "@/features/auth/domain/entities/session";
import type {
  AuthRepository,
  AuthStateCallback,
  Unsubscribe,
} from "@/features/auth/domain/repositories/auth-repository";
import type {
  SupabaseClient,
  Session as SupabaseSession,
  User as SupabaseUser,
} from "@supabase/supabase-js";

const mapInfraErrorToAppError = (error: unknown): AppError => {
  if (error instanceof SupabaseTimeoutError) {
    return AppError.networkTimeout(error.message, error);
  }
  if (error instanceof SupabaseNetworkError) {
    return AppError.network(error.message, error);
  }
  return AppError.fromUnknown(error);
};

const mapSupabaseUser = (user: SupabaseUser): User => ({
  id: user.id,
  email: user.email ?? "",
});

const mapSupabaseSession = (session: SupabaseSession): Session => ({
  accessToken: session.access_token,
  refreshToken: session.refresh_token,
  expiresAt: session.expires_at,
  user: mapSupabaseUser(session.user),
});

export const createSupabaseAuthRepository = (
  client: SupabaseClient,
): AuthRepository => ({
  signIn: async (credentials: SignInCredentials): Promise<Session> => {
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw AppError.unauthorized(error.message);
      }

      if (!data.session) {
        throw AppError.unauthorized("No session returned");
      }

      return mapSupabaseSession(data.session);
    } catch (error) {
      throw mapInfraErrorToAppError(error);
    }
  },

  signUp: async (credentials: SignUpCredentials): Promise<Session> => {
    try {
      const { data, error } = await client.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw AppError.unauthorized(error.message);
      }

      if (!data.session) {
        throw AppError.unauthorized("No session returned");
      }

      return mapSupabaseSession(data.session);
    } catch (error) {
      throw mapInfraErrorToAppError(error);
    }
  },

  signOut: async (): Promise<void> => {
    try {
      const { error } = await client.auth.signOut();

      if (error) {
        throw AppError.fromUnknown(error);
      }
    } catch (error) {
      throw mapInfraErrorToAppError(error);
    }
  },

  refreshSession: async (): Promise<Session> => {
    try {
      const { data, error } = await client.auth.refreshSession();

      if (error) {
        throw AppError.unauthorized(error.message);
      }

      if (!data.session) {
        throw AppError.unauthorized("No session found");
      }

      return mapSupabaseSession(data.session);
    } catch (error) {
      throw mapInfraErrorToAppError(error);
    }
  },

  setSession: async (session: Session): Promise<Session> => {
    try {
      const { error } = await client.auth.setSession({
        access_token: session.accessToken,
        refresh_token: session.refreshToken,
      });

      if (error) {
        throw AppError.unauthorized(error.message);
      }

      return session;
    } catch (error) {
      throw mapInfraErrorToAppError(error);
    }
  },

  getSession: async (): Promise<Session | null> => {
    try {
      const { data, error } = await client.auth.getSession();

      if (error || !data.session) {
        return null;
      }

      return mapSupabaseSession(data.session);
    } catch (error) {
      throw mapInfraErrorToAppError(error);
    }
  },

  subscribeToAuthChanges: (callback: AuthStateCallback): Unsubscribe => {
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
          if (session) {
            callback(mapSupabaseSession(session));
          }
          break;
        case "SIGNED_OUT":
          callback(null);
          break;
      }
    });

    return () => subscription.unsubscribe();
  },
});
