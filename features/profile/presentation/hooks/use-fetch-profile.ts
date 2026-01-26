import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/presentation/hooks/use-auth';
import { fetchProfile } from '@/features/profile/domain/usecases/fetch-profile';
import { getProfileRepository } from '@/features/profile/presentation/store/profile-repository';

export const useFetchProfile = () => {
  const { user } = useAuth();
  const repository = getProfileRepository();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: fetchProfile(repository),
    enabled: !!user,
    retry: false,
  });
};
