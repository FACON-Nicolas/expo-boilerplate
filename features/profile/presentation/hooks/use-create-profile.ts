import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createSupabaseProfileRepository } from '@/features/profile/data/repositories/supabase-profile-repository';
import { createProfile } from '@/features/profile/domain/usecases/create-profile';
import { supabaseClient } from '@/infrastructure/supabase/client';


import type { CreateProfileInput } from '@/features/profile/domain/entities/profile';


const profileRepository = createSupabaseProfileRepository(supabaseClient);

export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ profile, userId }: { profile: CreateProfileInput; userId: string }) => {
      return createProfile(profileRepository)(profile, userId);
    },
    onSuccess: async (_, { userId }) => {
      await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
};
