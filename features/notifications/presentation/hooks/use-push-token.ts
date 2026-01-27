import { useCallback } from 'react';

import { useAuth } from '@/features/auth/presentation/hooks/use-auth';
import { useNotificationStore } from '@/features/notifications/presentation/store/notification-store';
import { requestPermissions } from '@/infrastructure/notifications/expo-notification-service';

export const usePushToken = () => {
  const { user } = useAuth();

  const pushToken = useNotificationStore((state) => state.pushToken);
  const permissionStatus = useNotificationStore((state) => state.permissionStatus);
  const isLoading = useNotificationStore((state) => state.isLoading);
  const error = useNotificationStore((state) => state.error);
  const registerForPush = useNotificationStore((state) => state.registerForPush);
  const unregisterPush = useNotificationStore((state) => state.unregisterPush);
  const setPermissionStatus = useNotificationStore((state) => state.setPermissionStatus);

  const requestAndRegister = useCallback(async () => {
    if (!user) return null;

    const status = await requestPermissions();
    setPermissionStatus(status);

    if (status === 'granted') {
      return registerForPush(user.id);
    }

    return null;
  }, [user, registerForPush, setPermissionStatus]);

  const unregister = useCallback(async () => {
    if (!user) return;
    await unregisterPush(user.id);
  }, [user, unregisterPush]);

  return {
    pushToken,
    permissionStatus,
    isLoading,
    error,
    isRegistered: !!pushToken,
    requestAndRegister,
    unregister,
  };
};
