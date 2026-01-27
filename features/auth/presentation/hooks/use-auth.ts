import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useAuthStore } from '@/features/auth/presentation/store/auth-store';
import { profileQueryKeys } from '@/features/profile/presentation/query-keys';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const state = useAuthStore((state) => state);

  const signOutWithCleanup = useCallback(async () => {
    const userId = state.user?.id;
    await state.signOut();
    queryClient.removeQueries({ queryKey: profileQueryKeys.byUserId(userId) });
  }, [state, queryClient]);

  return {
    ...state,
    signOut: signOutWithCleanup,
  };
};
