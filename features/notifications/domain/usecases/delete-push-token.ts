import type { NotificationRepository } from '@/features/notifications/domain/repositories/notification-repository';

export const deletePushToken =
  (repository: NotificationRepository) =>
  async (userId: string): Promise<void> => {
    await repository.deletePushToken(userId);
  };
