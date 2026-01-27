import * as Sentry from '@sentry/react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { AppError } from '@/core/domain/errors/app-error';
import { getStorage } from '@/core/presentation/store/storage';
import { deletePushToken as deletePushTokenUsecase } from '@/features/notifications/domain/usecases/delete-push-token';
import { getPreferences as getPreferencesUsecase } from '@/features/notifications/domain/usecases/get-preferences';
import { registerForPush as registerForPushUsecase } from '@/features/notifications/domain/usecases/register-for-push';
import { updatePreferences as updatePreferencesUsecase } from '@/features/notifications/domain/usecases/update-preferences';

import type {
  NotificationCategory,
  NotificationPermissionStatus,
  NotificationPreferences,
  PushToken,
} from '@/features/notifications/domain/entities/notification';
import type { NotificationRepository } from '@/features/notifications/domain/repositories/notification-repository';
import type { StoreApi, UseBoundStore } from 'zustand';

type NotificationState = {
  pushToken: PushToken | null;
  permissionStatus: NotificationPermissionStatus;
  preferences: NotificationPreferences;
  isLoading: boolean;
  error: AppError | null;
};

type NotificationActions = {
  registerForPush: (userId: string) => Promise<PushToken | null>;
  unregisterPush: (userId: string) => Promise<void>;
  loadPreferences: (userId: string) => Promise<void>;
  updatePreferences: (userId: string, preferences: NotificationPreferences) => Promise<void>;
  toggleCategory: (userId: string, category: NotificationCategory) => Promise<void>;
  toggleEnabled: (userId: string) => Promise<void>;
  setPermissionStatus: (status: NotificationPermissionStatus) => void;
  clearError: () => void;
  reset: () => void;
};

type NotificationStore = NotificationState & NotificationActions;

type NotificationStorePersist = UseBoundStore<StoreApi<NotificationStore>> & {
  persist: {
    hasHydrated: () => boolean;
  };
};

const initialState: NotificationState = {
  pushToken: null,
  permissionStatus: 'undetermined',
  preferences: {
    enabled: true,
    categories: {
      marketing: true,
    },
  },
  isLoading: false,
  error: null,
};

export const createNotificationStore = (
  repository: NotificationRepository,
): NotificationStorePersist => {
  return create<NotificationStore>()(
    persist(
      (set, get) => ({
        ...initialState,

        registerForPush: async (userId: string) => {
          try {
            set({ isLoading: true, error: null });
            const token = await registerForPushUsecase(repository)(userId);

            if (token) {
              set({
                pushToken: token,
                permissionStatus: 'granted',
                isLoading: false,
              });
            } else {
              set({
                permissionStatus: 'denied',
                isLoading: false,
              });
            }

            return token;
          } catch (error: unknown) {
            Sentry.captureException(error);
            set({
              isLoading: false,
              error: AppError.fromUnknown(error),
            });
            return null;
          }
        },

        unregisterPush: async (userId: string) => {
          try {
            set({ isLoading: true, error: null });
            await deletePushTokenUsecase(repository)(userId);
            set({ pushToken: null, isLoading: false });
          } catch (error: unknown) {
            Sentry.captureException(error);
            set({
              isLoading: false,
              error: AppError.fromUnknown(error),
            });
          }
        },

        loadPreferences: async (userId: string) => {
          try {
            set({ isLoading: true, error: null });
            const preferences = await getPreferencesUsecase(repository)(userId);
            set({ preferences, isLoading: false });
          } catch (error: unknown) {
            Sentry.captureException(error);
            set({
              isLoading: false,
              error: AppError.fromUnknown(error),
            });
          }
        },

        updatePreferences: async (userId: string, preferences: NotificationPreferences) => {
          try {
            set({ isLoading: true, error: null });
            await updatePreferencesUsecase(repository)(userId, preferences);
            set({ preferences, isLoading: false });
          } catch (error: unknown) {
            Sentry.captureException(error);
            set({
              isLoading: false,
              error: AppError.fromUnknown(error),
            });
          }
        },

        toggleCategory: async (userId: string, category: NotificationCategory) => {
          const { preferences, updatePreferences } = get();
          const currentValue = preferences.categories[category] ?? false;

          await updatePreferences(userId, {
            ...preferences,
            categories: {
              ...preferences.categories,
              [category]: !currentValue,
            },
          });
        },

        toggleEnabled: async (userId: string) => {
          const { preferences, updatePreferences } = get();

          await updatePreferences(userId, {
            ...preferences,
            enabled: !preferences.enabled,
          });
        },

        setPermissionStatus: (status: NotificationPermissionStatus) => {
          set({ permissionStatus: status });
        },

        clearError: () => {
          set({ error: null });
        },

        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'notification-storage',
        storage: createJSONStorage(() => getStorage()),
        partialize: (state) => ({
          pushToken: state.pushToken,
          permissionStatus: state.permissionStatus,
          preferences: state.preferences,
        }),
        merge: (persistedState, currentState) => ({
          ...currentState,
          ...(persistedState as Partial<NotificationState>),
          isLoading: false,
          error: null,
        }),
      },
    ),
  ) as NotificationStorePersist;
};

let notificationStoreInstance: NotificationStorePersist | null = null;

export const initializeNotificationStore = (repository: NotificationRepository): void => {
  notificationStoreInstance = createNotificationStore(repository);
};

export const useNotificationStore: NotificationStorePersist = ((selector: unknown) => {
  if (!notificationStoreInstance) {
    throw new Error(
      'Notification store not initialized. Call initializeNotificationStore first.',
    );
  }
  if (typeof selector === 'function') {
    return notificationStoreInstance(selector as (state: NotificationStore) => unknown);
  }
  return notificationStoreInstance();
}) as NotificationStorePersist;

Object.defineProperty(useNotificationStore, 'persist', {
  get: () => {
    if (!notificationStoreInstance) {
      throw new Error(
        'Notification store not initialized. Call initializeNotificationStore first.',
      );
    }
    return notificationStoreInstance.persist;
  },
});

Object.defineProperty(useNotificationStore, 'getState', {
  get: () => {
    if (!notificationStoreInstance) {
      throw new Error(
        'Notification store not initialized. Call initializeNotificationStore first.',
      );
    }
    return notificationStoreInstance.getState;
  },
});

Object.defineProperty(useNotificationStore, 'setState', {
  get: () => {
    if (!notificationStoreInstance) {
      throw new Error(
        'Notification store not initialized. Call initializeNotificationStore first.',
      );
    }
    return notificationStoreInstance.setState;
  },
});

Object.defineProperty(useNotificationStore, 'subscribe', {
  get: () => {
    if (!notificationStoreInstance) {
      throw new Error(
        'Notification store not initialized. Call initializeNotificationStore first.',
      );
    }
    return notificationStoreInstance.subscribe;
  },
});
