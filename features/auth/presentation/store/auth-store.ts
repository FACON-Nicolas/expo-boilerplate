import * as Sentry from "@sentry/react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { secureStorage } from "@/core/data/storage/secure-storage";
import { AppError } from "@/core/domain/errors/app-error";
import { refreshSession as refreshSessionUsecase } from "@/features/auth/domain/usecases/refresh-session";
import { signIn as signInUsecase } from "@/features/auth/domain/usecases/sign-in";
import { signUp as signUpUsecase } from "@/features/auth/domain/usecases/sign-up";

import type {
  Session,
  SignInCredentials,
  SignUpCredentials,
  User,
} from "@/features/auth/domain/entities/session";
import type { AuthRepository } from "@/features/auth/domain/repositories/auth-repository";
import type { StoreApi, UseBoundStore } from "zustand";

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
  setSession: (session: Session) => void;
  clearSession: () => void;
};

type AuthStore = AuthState & AuthActions;

type AuthStorePersist = UseBoundStore<StoreApi<AuthStore>> & {
  persist: {
    hasHydrated: () => boolean;
  };
};

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: false,
  error: null,
};

export const createAuthStore = (
  repository: AuthRepository
): AuthStorePersist => {
  return create<AuthStore>()(
    persist(
      (set) => ({
        ...initialState,

        signIn: async (credentials: SignInCredentials) => {
          try {
            set({ isLoading: true, error: null });
            const session = await signInUsecase(repository)(credentials);
            set({ session, user: session.user, isLoading: false });
          } catch (error: unknown) {
            Sentry.captureException(error);
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
            const session = await signUpUsecase(repository)(credentials);
            set({ session, user: session.user, isLoading: false });
          } catch (error: unknown) {
            Sentry.captureException(error);
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
            await repository.signOut();
            set({ user: null, session: null, error: null });
          } catch (error: unknown) {
            Sentry.captureException(error);
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
              await refreshSessionUsecase(repository)(session);
            set({ session: refreshedSession, user: refreshedSession.user });
          } catch (error: unknown) {
            Sentry.captureException(error);
            set({
              error: AppError.fromUnknown(error),
              session: null,
              user: null,
            });
          }
        },

        setSession: (session: Session) => {
          set({ session, user: session.user, error: null });
        },

        clearSession: () => {
          set({ session: null, user: null, error: null });
        },
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => secureStorage),
      }
    )
  ) as AuthStorePersist;
};

let authStoreInstance: AuthStorePersist | null = null;

export const initializeAuthStore = (repository: AuthRepository): void => {
  authStoreInstance = createAuthStore(repository);
};

export const useAuthStore: AuthStorePersist = ((selector: unknown) => {
  if (!authStoreInstance) {
    throw new Error("Auth store not initialized. Call initializeAuthStore first.");
  }
  if (typeof selector === "function") {
    return authStoreInstance(selector as (state: AuthStore) => unknown);
  }
  return authStoreInstance();
}) as AuthStorePersist;

Object.defineProperty(useAuthStore, "persist", {
  get: () => {
    if (!authStoreInstance) {
      throw new Error("Auth store not initialized. Call initializeAuthStore first.");
    }
    return authStoreInstance.persist;
  },
});

Object.defineProperty(useAuthStore, "getState", {
  get: () => {
    if (!authStoreInstance) {
      throw new Error("Auth store not initialized. Call initializeAuthStore first.");
    }
    return authStoreInstance.getState;
  },
});

Object.defineProperty(useAuthStore, "setState", {
  get: () => {
    if (!authStoreInstance) {
      throw new Error("Auth store not initialized. Call initializeAuthStore first.");
    }
    return authStoreInstance.setState;
  },
});

Object.defineProperty(useAuthStore, "subscribe", {
  get: () => {
    if (!authStoreInstance) {
      throw new Error("Auth store not initialized. Call initializeAuthStore first.");
    }
    return authStoreInstance.subscribe;
  },
});
