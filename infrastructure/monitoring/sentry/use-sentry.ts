import { useMemo } from "react";

import { useSentryContext } from "@/core/presentation/hooks/use-sentry-context";
import {
  isSentryEnabled,
  reportErrorToSentry,
} from "@/infrastructure/monitoring/sentry/error-reporter";

export function useSentry() {
  const dependencies = useMemo(
    () => ({
      isEnabled: isSentryEnabled(),
      reportError: reportErrorToSentry,
    }),
    [],
  );

  return useSentryContext(dependencies);
}
