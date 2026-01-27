import { useAuthStateListener } from "@/features/auth/presentation/hooks/use-auth-state-listener";
import { useSessionBootstrap } from "@/features/auth/presentation/hooks/use-session-bootstrap";
import { useTokenRefresh } from "@/features/auth/presentation/hooks/use-token-refresh";

type UseAuthInitResult = void;

export function useAuthInit(): UseAuthInitResult {
  useSessionBootstrap();
  useAuthStateListener();
  useTokenRefresh();
}
