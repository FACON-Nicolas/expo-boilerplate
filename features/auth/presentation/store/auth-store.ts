import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Session, SignInCredentials, SignUpCredentials, User } from '../../domain/entities/session';
import { signIn as signInUsecase } from '../../domain/usecases/sign-in';
import { signUp as signUpUsecase } from '../../domain/usecases/sign-up';
import { refreshSession as refreshSessionUsecase } from '../../domain/usecases/refresh-session';
import { createSupabaseAuthRepository } from '../../data/repositories/supabase-auth-repository';
import { supabaseClient } from '@/infrastructure/supabase/client';
import { secureStorage } from '@/core/data/storage/secure-storage';

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
        } catch (error: any) {
          set({ isLoading: false, error: error.message, session: null, user: null });
          throw error;
        }
      },

      signUp: async (credentials: SignUpCredentials) => {
        try {
          set({ isLoading: true, error: null });
          const session = await signUpUsecase(authRepository)(credentials);
          set({ session, user: session.user, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false, error: error.message, session: null, user: null });
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
        } catch (error: any) {
          set({ error: error.message, session: null, user: null });
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
