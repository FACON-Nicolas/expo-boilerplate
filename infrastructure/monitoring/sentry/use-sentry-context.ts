import * as Sentry from "@sentry/react-native";
import { useCallback } from "react";

import { env } from "@/core/config/env";
import { reportErrorToSentry } from "@/infrastructure/monitoring/sentry/app-error-reporter";

import type {
  SentryBreadcrumb,
  SentryUser,
} from "@/infrastructure/monitoring/sentry/types";
import type { SeverityLevel } from "@sentry/react-native";

type UseSentryContextReturn = {
  setUser: (user: SentryUser | null) => void;
  addBreadcrumb: (breadcrumb: SentryBreadcrumb) => void;
  setTag: (key: string, value: string) => void;
  captureException: (
    error: unknown,
    context?: {
      tags?: Record<string, string>;
      extras?: Record<string, unknown>;
    },
  ) => void;
  captureMessage: (message: string, level?: SeverityLevel) => void;
};

export function useSentryContext(): UseSentryContextReturn {
  const isEnabled =
    env.EXPO_PUBLIC_SENTRY_ENABLED && !!env.EXPO_PUBLIC_SENTRY_DSN;

  const setUser = useCallback(
    (user: SentryUser | null) => {
      if (!isEnabled) return;
      Sentry.setUser(user);
    },
    [isEnabled],
  );

  const addBreadcrumb = useCallback(
    (breadcrumb: SentryBreadcrumb) => {
      if (!isEnabled) return;
      Sentry.addBreadcrumb({
        category: breadcrumb.category,
        message: breadcrumb.message,
        level: breadcrumb.level,
        data: breadcrumb.data,
      });
    },
    [isEnabled],
  );

  const setTag = useCallback(
    (key: string, value: string) => {
      if (!isEnabled) return;
      Sentry.setTag(key, value);
    },
    [isEnabled],
  );

  const captureException = useCallback(
    (
      error: unknown,
      context?: {
        tags?: Record<string, string>;
        extras?: Record<string, unknown>;
      },
    ) => {
      if (!isEnabled) return;
      reportErrorToSentry(error, context);
    },
    [isEnabled],
  );

  const captureMessage = useCallback(
    (message: string, level: SeverityLevel = "info") => {
      if (!isEnabled) return;
      Sentry.captureMessage(message, level);
    },
    [isEnabled],
  );

  return {
    setUser,
    addBreadcrumb,
    setTag,
    captureException,
    captureMessage,
  };
}
