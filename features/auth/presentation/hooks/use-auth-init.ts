import { useAuthStateListener } from "@/features/auth/presentation/hooks/use-auth-state-listener";
import { useSessionBootstrap } from "@/features/auth/presentation/hooks/use-session-bootstrap";
import { useTokenRefresh } from "@/features/auth/presentation/hooks/use-token-refresh";

type UseAuthInitResult = {
  isBootstrapping: boolean;
};

export function useAuthInit(): UseAuthInitResult {
  const { isBootstrapping } = useSessionBootstrap();

  useAuthStateListener();
  useTokenRefresh();

  return { isBootstrapping };
}
