import "@/global.css";

import * as Sentry from "@sentry/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useNavigationContainerRef } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { queryClient } from "@/core/config/query-client";
import { ErrorBoundary } from "@/core/presentation/components/error-boundary";
import { ErrorFallback } from "@/core/presentation/components/error-fallback";
import { SplashGate } from "@/core/presentation/components/splash-gate";
import { useAuthentication } from "@/features/auth/presentation/hooks/use-authentication";
import {
  initializeSentry,
  navigationIntegration,
} from "@/infrastructure/monitoring/sentry/client";

import "@/i18n";

initializeSentry();

function NavigationStack() {
  const { isUserAuthenticated } = useAuthentication();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isUserAuthenticated}>
        <Stack.Screen name='(protected)' />
      </Stack.Protected>
      <Stack.Protected guard={!isUserAuthenticated}>
        <Stack.Screen name='(public)' />
      </Stack.Protected>
    </Stack>
  );
}

function RootLayout() {
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    if (navigationRef.current) {
      navigationIntegration.registerNavigationContainer(navigationRef);
    }
  }, [navigationRef]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar translucent />
        <ErrorBoundary fallback={(props) => <ErrorFallback {...props} />}>
          <SplashGate>
            <HeroUINativeProvider>
              <NavigationStack />
            </HeroUINativeProvider>
          </SplashGate>
        </ErrorBoundary>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(RootLayout);
