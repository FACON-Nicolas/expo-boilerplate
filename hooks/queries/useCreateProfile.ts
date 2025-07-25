import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreateProfile } from '@/types/profile';
import { createProfileFromSupabase } from '@/api/profile';
import { router } from 'expo-router';

export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      profile,
      userId,
    }: {
      profile: CreateProfile;
      userId: string;
    }) => {
      return await createProfileFromSupabase(profile, userId);
    },
    onSuccess: async (_, { userId }) => {
      await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      router.replace('/(protected)/(tabs)');
    },
  });
};
