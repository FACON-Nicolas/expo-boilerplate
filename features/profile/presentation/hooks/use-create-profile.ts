import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateProfileInput } from '../../domain/entities/profile';
import { createProfile } from '../../domain/usecases/create-profile';
import { createSupabaseProfileRepository } from '../../data/repositories/supabase-profile-repository';
import { supabaseClient } from '@/infrastructure/supabase/client';

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
