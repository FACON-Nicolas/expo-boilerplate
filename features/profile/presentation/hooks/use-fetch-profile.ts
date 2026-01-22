import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/presentation/hooks/use-auth';
import { fetchProfile } from '../../domain/usecases/fetch-profile';
import { createSupabaseProfileRepository } from '../../data/repositories/supabase-profile-repository';
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
