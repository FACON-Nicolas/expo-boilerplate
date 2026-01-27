export const profileQueryKeys = {
  all: ['profile'] as const,
  byUserId: (userId: string | undefined) => ['profile', userId] as const,
};
