import { validateWithI18nAsync } from '@/core/domain/validation/validator';
import { notificationPreferencesSchema } from '@/features/notifications/domain/validation/notification-schema';

import type { NotificationPreferences } from '@/features/notifications/domain/entities/notification';
import type { NotificationRepository } from '@/features/notifications/domain/repositories/notification-repository';

export const updatePreferences =
  (repository: NotificationRepository) =>
  async (userId: string, preferences: NotificationPreferences): Promise<void> => {
    const validatedPreferences = await validateWithI18nAsync(
      notificationPreferencesSchema,
      preferences,
    );
    await repository.updatePreferences(userId, validatedPreferences);
  };
