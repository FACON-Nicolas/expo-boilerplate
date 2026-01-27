import type { NotificationRepository } from '@/features/notifications/domain/repositories/notification-repository';

let repository: NotificationRepository | null = null;

export const initializeNotificationRepository = (repo: NotificationRepository): void => {
  repository = repo;
};

export const getNotificationRepository = (): NotificationRepository => {
  if (!repository) {
    throw new Error(
      'Notification repository not initialized. Call initializeNotificationRepository first.',
    );
  }
  return repository;
};
