import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type {
  NotificationPermissionStatus,
  PushToken,
} from '@/features/notifications/domain/entities/notification';

export type NotificationReceivedListener = (
  notification: Notifications.Notification,
) => void;

export type NotificationResponseListener = (
  response: Notifications.NotificationResponse,
) => void;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

export const getPermissionStatus = async (): Promise<NotificationPermissionStatus> => {
  const { status } = await Notifications.getPermissionsAsync();

  if (status === 'granted') return 'granted';
  if (status === 'denied') return 'denied';
  return 'undetermined';
};

export const requestPermissions = async (): Promise<NotificationPermissionStatus> => {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status === 'granted') return 'granted';
  if (status === 'denied') return 'denied';
  return 'undetermined';
};

export const registerForPushNotifications = async (): Promise<PushToken | null> => {
  if (!Device.isDevice) {
    return null;
  }

  const permissionStatus = await getPermissionStatus();

  if (permissionStatus === 'denied') {
    return null;
  }

  if (permissionStatus === 'undetermined') {
    const newStatus = await requestPermissions();
    if (newStatus !== 'granted') {
      return null;
    }
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();

  return {
    token: tokenData.data,
    platform: Platform.OS as 'ios' | 'android',
    createdAt: new Date(),
  };
};

export const addNotificationReceivedListener = (
  listener: NotificationReceivedListener,
): Notifications.EventSubscription => {
  return Notifications.addNotificationReceivedListener(listener);
};

export const addNotificationResponseListener = (
  listener: NotificationResponseListener,
): Notifications.EventSubscription => {
  return Notifications.addNotificationResponseReceivedListener(listener);
};

export const getLastNotificationResponse =
  Notifications.getLastNotificationResponseAsync;

export const setBadgeCount = Notifications.setBadgeCountAsync;

export const getBadgeCount = Notifications.getBadgeCountAsync;

export const dismissAllNotifications = Notifications.dismissAllNotificationsAsync;

export const scheduleLocalNotification = async (
  title: string,
  body: string,
  data?: Record<string, unknown>,
  trigger?: Notifications.NotificationTriggerInput,
): Promise<string> => {
  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: trigger ?? null,
  });
};

export const cancelScheduledNotification = Notifications.cancelScheduledNotificationAsync;

export const cancelAllScheduledNotifications =
  Notifications.cancelAllScheduledNotificationsAsync;
