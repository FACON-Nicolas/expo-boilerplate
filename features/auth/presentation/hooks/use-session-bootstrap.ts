import * as Sentry from "@sentry/react-native";
import { useEffect } from "react";

import { useToggle } from "@/core/presentation/hooks/use-toggle";
import { getAuthRepository } from "@/features/auth/presentation/store/auth-repository";
import { useAuthStore } from "@/features/auth/presentation/store/auth-store";

type UseSessionBootstrapResult = {
  isBootstrapping: boolean;
};

export function useSessionBootstrap(): UseSessionBootstrapResult {
  const [isBootstrapping, toggleBootstrapping] = useToggle(true);
  const repository = getAuthRepository();
  const session = useAuthStore((state) => state.session);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const hasHydrated = useAuthStore.persist.hasHydrated();

  useEffect(() => {
    if (!hasHydrated) return;

    const verifySession = async () => {
      if (!session) {
        toggleBootstrapping();
        return;
      }

      try {
        const currentSession = await repository.getSession();

        if (!currentSession) {
          clearSession();
        } else {
          setSession(currentSession);
        }
        toggleBootstrapping();
      } catch (error) {
        Sentry.captureException(error);
        clearSession();
        toggleBootstrapping();
      }
    };

    verifySession();
  }, [
    hasHydrated,
    session,
    setSession,
    clearSession,
    repository,
    toggleBootstrapping,
  ]);

  return { isBootstrapping };
}
