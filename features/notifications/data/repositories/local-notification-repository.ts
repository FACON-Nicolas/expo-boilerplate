import type { StorageAdapter } from '@/core/domain/storage/storage-adapter';
import type {
  NotificationPreferences,
  PushToken,
} from '@/features/notifications/domain/entities/notification';
import type { NotificationRepository } from '@/features/notifications/domain/repositories/notification-repository';

const STORAGE_KEYS = {
  pushToken: (userId: string) => `notification_push_token_${userId}`,
  preferences: (userId: string) => `notification_preferences_${userId}`,
} as const;

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  categories: {
    marketing: true,
  },
};

export const createLocalNotificationRepository = (
  storage: StorageAdapter,
): NotificationRepository => ({
  savePushToken: async (userId: string, token: PushToken): Promise<void> => {
    const key = STORAGE_KEYS.pushToken(userId);
    await storage.setItem(key, JSON.stringify(token));
  },

  deletePushToken: async (userId: string): Promise<void> => {
    const key = STORAGE_KEYS.pushToken(userId);
    await storage.removeItem(key);
  },

  getPreferences: async (userId: string): Promise<NotificationPreferences> => {
    const key = STORAGE_KEYS.preferences(userId);
    const stored = await storage.getItem(key);

    if (!stored) {
      return DEFAULT_PREFERENCES;
    }

    return JSON.parse(stored) as NotificationPreferences;
  },

  updatePreferences: async (
    userId: string,
    preferences: NotificationPreferences,
  ): Promise<void> => {
    const key = STORAGE_KEYS.preferences(userId);
    await storage.setItem(key, JSON.stringify(preferences));
  },
});
