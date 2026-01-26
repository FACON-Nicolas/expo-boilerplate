import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useThemeSync } from "@/core/presentation/hooks/use-theme-sync";
import { useToggle } from "@/core/presentation/hooks/use-toggle";

import type { ReactNode } from "react";

SplashScreen.preventAutoHideAsync();

type SplashGateProps = {
  children: ReactNode;
};

export function SplashGate({ children }: SplashGateProps) {
  const { isThemeStoreHydrated } = useThemeSync();
  const [isSplashHidden, toggleSplashHidden] = useToggle(false);

  useEffect(() => {
    if (isThemeStoreHydrated && !isSplashHidden) {
      SplashScreen.hideAsync().then(toggleSplashHidden);
    }
  }, [isThemeStoreHydrated, isSplashHidden, toggleSplashHidden]);

  if (!isThemeStoreHydrated) {
    return null;
  }

  return children;
}
