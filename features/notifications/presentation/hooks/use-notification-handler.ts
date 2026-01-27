import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Linking } from 'react-native';

import {
  addNotificationReceivedListener,
  addNotificationResponseListener,
} from '@/infrastructure/notifications/expo-notification-service';

import type {
  NotificationAction,
  NotificationPayload,
} from '@/features/notifications/domain/entities/notification';
import type * as Notifications from 'expo-notifications';

type CustomActionHandler = (
  handler: string,
  payload?: Record<string, unknown>,
) => void | Promise<void>;

type NotificationHandlerOptions = {
  onNotificationReceived?: (payload: NotificationPayload) => void;
  onCustomAction?: CustomActionHandler;
};

const parseNotificationPayload = (
  notification: Notifications.Notification,
): NotificationPayload => {
  const { content } = notification.request;
  const data = content.data as Record<string, unknown> | undefined;

  return {
    id: notification.request.identifier,
    title: content.title ?? '',
    body: content.body ?? '',
    category: data?.category as string | undefined,
    action: data?.action as NotificationAction | undefined,
    data,
    receivedAt: new Date(notification.date),
  };
};

export const useNotificationHandler = (options?: NotificationHandlerOptions) => {
  const router = useRouter();
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const executeAction = async (action: NotificationAction) => {
      switch (action.type) {
        case 'navigate':
          router.push({
            pathname: action.screen as '/',
            params: action.params as Record<string, string>,
          });
          break;

        case 'open-url':
          await Linking.openURL(action.url);
          break;

        case 'custom':
          if (optionsRef.current?.onCustomAction) {
            await optionsRef.current.onCustomAction(action.handler, action.payload);
          }
          break;
      }
    };

    const receivedSubscription = addNotificationReceivedListener((notification) => {
      const payload = parseNotificationPayload(notification);

      if (optionsRef.current?.onNotificationReceived) {
        optionsRef.current.onNotificationReceived(payload);
      }
    });

    const responseSubscription = addNotificationResponseListener((response) => {
      const payload = parseNotificationPayload(response.notification);

      if (payload.action) {
        executeAction(payload.action);
      }
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [router]);
};
