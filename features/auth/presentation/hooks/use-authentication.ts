import { useAuth } from '@/features/auth/presentation/hooks/use-auth';

import type { SignInCredentials, SignUpCredentials } from '@/features/auth/domain/entities/session';

export function useAuthentication() {
  const { user, isLoading, error, clearError, signIn: signInStore, signUp: signUpStore } = useAuth();

  const signIn = async (credentials: SignInCredentials) => {
    clearError();
    await signInStore(credentials);
  };

  const signUp = async (credentials: SignUpCredentials) => {
    clearError();
    await signUpStore(credentials);
  };

  return {
    isUserAuthenticated: Boolean(user),
    isUserLoading: isLoading,
    error,
    signIn,
    signUp,
  };
}
