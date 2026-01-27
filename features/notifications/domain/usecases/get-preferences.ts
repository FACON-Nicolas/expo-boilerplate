import type { NotificationPreferences } from '@/features/notifications/domain/entities/notification';
import type { NotificationRepository } from '@/features/notifications/domain/repositories/notification-repository';

export const getPreferences =
  (repository: NotificationRepository) =>
  async (userId: string): Promise<NotificationPreferences> => {
    return repository.getPreferences(userId);
  };
