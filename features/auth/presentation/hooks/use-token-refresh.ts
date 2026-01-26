import { useEffect, useMemo } from "react";

import { getAuthRepository } from "@/features/auth/presentation/store/auth-repository";
import { useAuthStore } from "@/features/auth/presentation/store/auth-store";

const REFRESH_THRESHOLD_MS = 5 * 60 * 1000;

export function useTokenRefresh(): void {
  const repository = useMemo(() => getAuthRepository(), []);
  const session = useAuthStore((state) => state.session);

  useEffect(() => {
    if (!session?.expiresAt) return;

    const expiresAtMs = session.expiresAt * 1000;
    const now = Date.now();
    const timeUntilRefresh = expiresAtMs - now - REFRESH_THRESHOLD_MS;

    if (timeUntilRefresh <= 0) {
      repository.refreshSession();
      return;
    }

    const timer = setTimeout(() => {
      repository.refreshSession();
    }, timeUntilRefresh);

    return () => clearTimeout(timer);
  }, [session?.expiresAt, repository]);
}
