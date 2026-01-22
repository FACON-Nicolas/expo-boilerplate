import { useState } from 'react';
import { useAuth } from './use-auth';
import type { SignInCredentials, SignUpCredentials } from '../../domain/entities/session';

export function useAuthentication() {
  const { user, isLoading, signIn: signInStore, signUp: signUpStore } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const signIn = async (credentials: SignInCredentials) => {
    try {
      setError(null);
      await signInStore(credentials);
    } catch (err: Error | any) {
      setError(err.message);
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    try {
      setError(null);
      await signUpStore(credentials);
    } catch (err: Error | any) {
      setError(err.message);
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
