import { useAppSelector } from '@/redux/store';
import { selectAuthState } from '@/redux/auth';

export function useAuthenticationManagement() {
  const { user, isLoading } = useAppSelector(selectAuthState);

  return {
    isUserAuthenticated: Boolean(user),
    isUserLoading: isLoading,
  };
}
