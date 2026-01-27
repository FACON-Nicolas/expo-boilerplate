import { z } from 'zod';

export const notificationCategorySchema = z.string().min(1);

export const notificationPreferencesSchema = z.object({
  enabled: z.boolean(),
  categories: z.record(z.string(), z.boolean()),
});

export const pushTokenSchema = z.object({
  token: z.string().min(1, 'errors.notification.tokenRequired'),
  platform: z.enum(['ios', 'android']),
  createdAt: z.date(),
});

export const notificationActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('navigate'),
    screen: z.string(),
    params: z.record(z.string(), z.unknown()).optional(),
  }),
  z.object({
    type: z.literal('open-url'),
    url: z.string().url(),
  }),
  z.object({
    type: z.literal('custom'),
    handler: z.string(),
    payload: z.record(z.string(), z.unknown()).optional(),
  }),
]);

export const notificationPayloadSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  category: z.string().optional(),
  action: notificationActionSchema.optional(),
  data: z.record(z.string(), z.unknown()).optional(),
  receivedAt: z.date(),
});
