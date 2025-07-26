import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/store/auth';
import { getProfileFromSupabase } from '@/api/profile';

export const useFetchProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: getProfileFromSupabase,
    enabled: !!user,
    retry: false,
  });
};
