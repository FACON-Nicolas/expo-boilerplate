import { useCallback } from 'react';

import { useAuth } from '@/features/auth/presentation/hooks/use-auth';
import { useNotificationStore } from '@/features/notifications/presentation/store/notification-store';

import type { NotificationCategory } from '@/features/notifications/domain/entities/notification';

export const useNotificationPreferences = () => {
  const { user } = useAuth();

  const preferences = useNotificationStore((state) => state.preferences);
  const isLoading = useNotificationStore((state) => state.isLoading);
  const error = useNotificationStore((state) => state.error);
  const toggleCategory = useNotificationStore((state) => state.toggleCategory);
  const toggleEnabled = useNotificationStore((state) => state.toggleEnabled);
  const updatePreferences = useNotificationStore((state) => state.updatePreferences);

  const toggleCategoryPreference = useCallback(
    async (category: NotificationCategory) => {
      if (!user) return;
      await toggleCategory(user.id, category);
    },
    [user, toggleCategory],
  );

  const toggleEnabledPreference = useCallback(async () => {
    if (!user) return;
    await toggleEnabled(user.id);
  }, [user, toggleEnabled]);

  const isCategoryEnabled = useCallback(
    (category: NotificationCategory): boolean => {
      return preferences.enabled && (preferences.categories[category] ?? false);
    },
    [preferences],
  );

  const addCategory = useCallback(
    async (category: NotificationCategory, enabled = true) => {
      if (!user) return;
      await updatePreferences(user.id, {
        ...preferences,
        categories: {
          ...preferences.categories,
          [category]: enabled,
        },
      });
    },
    [user, preferences, updatePreferences],
  );

  return {
    preferences,
    isLoading,
    error,
    isEnabled: preferences.enabled,
    toggleCategoryPreference,
    toggleEnabledPreference,
    isCategoryEnabled,
    addCategory,
  };
};
