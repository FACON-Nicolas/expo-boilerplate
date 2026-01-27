export type NotificationCategory = 'marketing' | (string & {});

export type NotificationPreferences = {
  enabled: boolean;
  categories: Record<NotificationCategory, boolean>;
};

export type PushToken = {
  token: string;
  platform: 'ios' | 'android';
  createdAt: Date;
};

export type NotificationActionType = 'navigate' | 'open-url' | 'custom';

export type NotificationAction =
  | { type: 'navigate'; screen: string; params?: Record<string, unknown> }
  | { type: 'open-url'; url: string }
  | { type: 'custom'; handler: string; payload?: Record<string, unknown> };

export type NotificationPayload = {
  id: string;
  title: string;
  body: string;
  category?: NotificationCategory;
  action?: NotificationAction;
  data?: Record<string, unknown>;
  receivedAt: Date;
};

export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';
