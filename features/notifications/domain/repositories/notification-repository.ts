import type {
  NotificationPreferences,
  PushToken,
} from '@/features/notifications/domain/entities/notification';

export type NotificationRepository = {
  savePushToken: (userId: string, token: PushToken) => Promise<void>;
  deletePushToken: (userId: string) => Promise<void>;
  getPreferences: (userId: string) => Promise<NotificationPreferences>;
  updatePreferences: (userId: string, preferences: NotificationPreferences) => Promise<void>;
};
