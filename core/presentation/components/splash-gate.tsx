import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useThemeSync } from "@/core/presentation/hooks/use-theme-sync";
import { useToggle } from "@/core/presentation/hooks/use-toggle";

import type { ReactNode } from "react";

SplashScreen.preventAutoHideAsync();

type SplashGateProps = {
  children: ReactNode;
  isAuthReady?: boolean;
};

export function SplashGate({ children, isAuthReady = true }: SplashGateProps) {
  const { isThemeStoreHydrated } = useThemeSync();
  const [isSplashHidden, toggleSplashHidden] = useToggle(false);

  const isReady = isThemeStoreHydrated && isAuthReady;

  useEffect(() => {
    if (isReady && !isSplashHidden) {
      SplashScreen.hideAsync().then(toggleSplashHidden);
    }
  }, [isReady, isSplashHidden, toggleSplashHidden]);

  if (!isReady) {
    return null;
  }

  return children;
}
