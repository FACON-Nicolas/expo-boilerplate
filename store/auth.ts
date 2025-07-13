import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { Session, User } from '@supabase/supabase-js';
import { SignInUser, SignUpUser } from '@/types/user';
import {
  refreshSessionFromSupabase,
  setSessionFromSupabase,
  signInFromSupabase,
  signUpFromSupabase,
} from '@/api/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  session: Session | null;
}

interface AuthActions {
  setError: (error: string | null) => void;
  signOut: () => void;
  signIn: (credentials: SignInUser) => Promise<void>;
  signUp: (credentials: SignUpUser) => Promise<void>;
  setSupabaseSessionAndRefresh: (session: Session) => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  session: null,
};

const formatKey = (key: string): string => {
  return key.replaceAll(':', '');
};

const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    const value = await SecureStore.getItemAsync(formatKey(key));
    return value || null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(formatKey(key), value);
  },
  removeItem: async (key: string): Promise<void> => {
    await SecureStore.deleteItemAsync(formatKey(key));
  },
};

const signIn = async (
  credentials: SignInUser,
  set: (state: Partial<AuthStore>) => void
): Promise<void> => {
  try {
    set({ isLoading: true });
    const { session, user } = await signInFromSupabase(credentials);
    set({ isLoading: false, error: null, session, user });
  } catch (error: any) {
    set({ isLoading: false, error: error.message, session: null, user: null });
    throw error;
  }
};

const signUp = async (
  credentials: SignUpUser,
  set: (state: Partial<AuthStore>) => void
): Promise<void> => {
  try {
    set({ isLoading: true });
    const { session, user } = await signUpFromSupabase(credentials);
    set({
      isLoading: false,
      error: null,
      session,
      user,
    });
  } catch (error: any) {
    set({ isLoading: false, error: error.message, session: null, user: null });
    throw error;
  }
};

const setSupabaseSessionAndRefresh = async (
  session: Session,
  set: (state: Partial<AuthStore>) => void
): Promise<void> => {
  try {
    await setSessionFromSupabase(session);
    const refreshedSession = await refreshSessionFromSupabase();
    set({ session: refreshedSession });
  } catch (error: any) {
    set({ error: error.message, session: null, user: null });
    throw error;
  }
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setError: (error: string | null) => set({ error }),
      signOut: () => set({ user: null, session: null }),
      signIn: (credentials: SignInUser) => signIn(credentials, set),
      signUp: (credentials: SignUpUser) => signUp(credentials, set),
      setSupabaseSessionAndRefresh: (session: Session) =>
        setSupabaseSessionAndRefresh(session, set),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);

export const useAuth = () => useAuthStore((state) => state);
