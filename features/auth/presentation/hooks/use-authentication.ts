import { useState } from 'react';

import { useAuth } from '@/features/auth/presentation/hooks/use-auth';

import type { SignInCredentials, SignUpCredentials } from '@/features/auth/domain/entities/session';

export function useAuthentication() {
  const { user, isLoading, signIn: signInStore, signUp: signUpStore } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const signIn = async (credentials: SignInCredentials) => {
    try {
      setError(null);
      await signInStore(credentials);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    try {
      setError(null);
      await signUpStore(credentials);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return {
    isUserAuthenticated: Boolean(user),
    isUserLoading: isLoading,
    error,
    signIn,
    signUp,
  };
}
