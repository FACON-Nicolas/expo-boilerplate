import { useAuth } from '@/store/auth';
import { SignInUser, SignUpUser } from '@/types/user';
import { useState } from 'react';

export function useAuthentication() {
  const {
    user,
    isLoading,
    signIn: signInStore,
    signUp: signUpStore,
  } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const signIn = async (user: SignInUser) => {
    try {
      setError(null);
      await signInStore(user);
    } catch (error: Error | any) {
      setError(error.message);
    }
  };

  const signUp = async (user: SignUpUser) => {
    try {
      setError(null);
      await signUpStore(user);
    } catch (error: Error | any) {
      setError(error.message);
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
