import { useEffect, useRef } from 'react';

import { useAuth } from '@/features/auth/presentation/hooks/use-auth';
import { useNotificationHandler } from '@/features/notifications/presentation/hooks/use-notification-handler';
import { useNotificationStore } from '@/features/notifications/presentation/store/notification-store';
import {
  getPermissionStatus,
  getLastNotificationResponse,
} from '@/infrastructure/notifications/expo-notification-service';


export const useNotificationsInit = () => {
  const { user } = useAuth();
  const loadPreferences = useNotificationStore((state) => state.loadPreferences);
  const setPermissionStatus = useNotificationStore((state) => state.setPermissionStatus);
  const registerForPush = useNotificationStore((state) => state.registerForPush);

  const isInitialized = useRef(false);

  useNotificationHandler();

  useEffect(() => {
    if (!user || isInitialized.current) return;

    const initializeNotifications = async () => {
      isInitialized.current = true;

      const permissionStatus = await getPermissionStatus();
      setPermissionStatus(permissionStatus);

      await loadPreferences(user.id);

      if (permissionStatus === 'granted') {
        await registerForPush(user.id);
      }

      const lastResponse = await getLastNotificationResponse();
      if (lastResponse) {
        // Handle notification that launched the app
        // This will be processed by useNotificationHandler
      }
    };

    initializeNotifications();
  }, [user, loadPreferences, setPermissionStatus, registerForPush]);

  useEffect(() => {
    if (!user) {
      isInitialized.current = false;
    }
  }, [user]);
};
