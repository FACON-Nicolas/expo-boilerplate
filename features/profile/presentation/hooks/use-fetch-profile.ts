import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/presentation/hooks/use-auth';
import { createSupabaseProfileRepository } from '@/features/profile/data/repositories/supabase-profile-repository';
import { fetchProfile } from '@/features/profile/domain/usecases/fetch-profile';
import { supabaseClient } from '@/infrastructure/supabase/client';

const profileRepository = createSupabaseProfileRepository(supabaseClient);

export const useFetchProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: fetchProfile(profileRepository),
    enabled: !!user,
    retry: false,
  });
};
