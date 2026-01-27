import { registerForPushNotifications } from '@/infrastructure/notifications/expo-notification-service';

import type { PushToken } from '@/features/notifications/domain/entities/notification';
import type { NotificationRepository } from '@/features/notifications/domain/repositories/notification-repository';

export const registerForPush =
  (repository: NotificationRepository) =>
  async (userId: string): Promise<PushToken | null> => {
    const token = await registerForPushNotifications();

    if (token) {
      await repository.savePushToken(userId, token);
    }

    return token;
  };
