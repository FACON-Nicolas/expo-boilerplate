import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { secureStorage } from '@/core/data/storage/secure-storage';
import { createSupabaseAuthRepository } from '@/features/auth/data/repositories/supabase-auth-repository';
import { refreshSession as refreshSessionUsecase } from '@/features/auth/domain/usecases/refresh-session';
import { signIn as signInUsecase } from '@/features/auth/domain/usecases/sign-in';
import { signUp as signUpUsecase } from '@/features/auth/domain/usecases/sign-up';
import { supabaseClient } from '@/infrastructure/supabase/client';


import type { Session, SignInCredentials, SignUpCredentials, User } from '@/features/auth/domain/entities/session';

type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
};

type AuthActions = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => void;
  setError: (error: string | null) => void;
  refreshAndSetSession: (session: Session) => Promise<void>;
};

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: false,
  error: null,
};

const authRepository = createSupabaseAuthRepository(supabaseClient);

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      signIn: async (credentials: SignInCredentials) => {
        try {
          set({ isLoading: true, error: null });
          const session = await signInUsecase(authRepository)(credentials);
          set({ session, user: session.user, isLoading: false });
        } catch (error: unknown) {
          set({ isLoading: false, error: error instanceof Error ? error.message : 'An error occurred', session: null, user: null });
          throw error;
        }
      },

      signUp: async (credentials: SignUpCredentials) => {
        try {
          set({ isLoading: true, error: null });
          const session = await signUpUsecase(authRepository)(credentials);
          set({ session, user: session.user, isLoading: false });
        } catch (error: unknown) {
          set({ isLoading: false, error: error instanceof Error ? error.message : 'An error occurred', session: null, user: null });
          throw error;
        }
      },

      signOut: () => {
        set({ user: null, session: null, error: null });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      refreshAndSetSession: async (session: Session) => {
        try {
          const refreshedSession = await refreshSessionUsecase(authRepository)(session);
          set({ session: refreshedSession, user: refreshedSession.user });
        } catch (error: unknown) {
          set({ error: error instanceof Error ? error.message : 'An error occurred', session: null, user: null });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
