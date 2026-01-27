import { validateWithI18nAsync } from '@/core/domain/validation/validator';
import { pushTokenSchema } from '@/features/notifications/domain/validation/notification-schema';

import type { PushToken } from '@/features/notifications/domain/entities/notification';
import type { NotificationRepository } from '@/features/notifications/domain/repositories/notification-repository';

export const savePushToken =
  (repository: NotificationRepository) =>
  async (userId: string, token: PushToken): Promise<void> => {
    const validatedToken = await validateWithI18nAsync(pushTokenSchema, token);
    await repository.savePushToken(userId, validatedToken);
  };
