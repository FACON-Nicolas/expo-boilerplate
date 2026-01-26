import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createProfile } from '@/features/profile/domain/usecases/create-profile';
import { getProfileRepository } from '@/features/profile/presentation/store/profile-repository';

import type { CreateProfileInput } from '@/features/profile/domain/entities/profile';

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  const repository = getProfileRepository();

  return useMutation({
    mutationFn: async ({ profile, userId }: { profile: CreateProfileInput; userId: string }) => {
      return createProfile(repository)(profile, userId);
    },
    onSuccess: async (_, { userId }) => {
      await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
};
