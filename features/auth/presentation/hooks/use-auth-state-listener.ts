import { useEffect } from "react";

import { getAuthRepository } from "@/features/auth/presentation/store/auth-repository";
import { useAuthStore } from "@/features/auth/presentation/store/auth-store";

export function useAuthStateListener(): void {
  const repository = getAuthRepository();
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    const unsubscribe = repository.subscribeToAuthChanges((session) => {
      if (session) {
        setSession(session);
      } else {
        clearSession();
      }
    });

    return unsubscribe;
  }, [repository, setSession, clearSession]);
}
