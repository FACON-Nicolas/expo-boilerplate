import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useToggle } from "@/core/presentation/hooks/use-toggle";

import type { ReactNode } from "react";

SplashScreen.preventAutoHideAsync();

type SplashGateProps = {
  children: ReactNode;
};

export function SplashGate({ children }: SplashGateProps) {
  const [isSplashHidden, toggleSplashHidden] = useToggle(false);

  useEffect(() => {
    if (!isSplashHidden) {
      SplashScreen.hideAsync().then(toggleSplashHidden);
    }
  }, [isSplashHidden]);

  return children;
}
