import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { secureStorage } from "@/core/data/storage/secure-storage";
import { AppError } from "@/core/domain/errors/app-error";
import { createSupabaseAuthRepository } from "@/features/auth/data/repositories/supabase-auth-repository";
import { refreshSession as refreshSessionUsecase } from "@/features/auth/domain/usecases/refresh-session";
import { signIn as signInUsecase } from "@/features/auth/domain/usecases/sign-in";
import { signUp as signUpUsecase } from "@/features/auth/domain/usecases/sign-up";
import { supabaseClient } from "@/infrastructure/supabase/client";

import type {
  Session,
  SignInCredentials,
  SignUpCredentials,
  User,
} from "@/features/auth/domain/entities/session";

type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AppError | null;
};

type AuthActions = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  setError: (error: AppError | null) => void;
  clearError: () => void;
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
          set({
            isLoading: false,
            error: AppError.fromUnknown(error),
            session: null,
            user: null,
          });
        }
      },

      signUp: async (credentials: SignUpCredentials) => {
        try {
          set({ isLoading: true, error: null });
          const session = await signUpUsecase(authRepository)(credentials);
          set({ session, user: session.user, isLoading: false });
        } catch (error: unknown) {
          set({
            isLoading: false,
            error: AppError.fromUnknown(error),
            session: null,
            user: null,
          });
        }
      },

      signOut: async () => {
        try {
          await authRepository.signOut();
          set({ user: null, session: null, error: null });
        } catch (error: unknown) {
          set({ error: AppError.fromUnknown(error) });
        }
      },

      setError: (error: AppError | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      refreshAndSetSession: async (session: Session) => {
        try {
          const refreshedSession =
            await refreshSessionUsecase(authRepository)(session);
          set({ session: refreshedSession, user: refreshedSession.user });
        } catch (error: unknown) {
          set({
            error: AppError.fromUnknown(error),
            session: null,
            user: null,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
    },
  ),
);
