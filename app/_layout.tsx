import "@/global.css";

import * as Sentry from "@sentry/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useNavigationContainerRef } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { queryClient } from "@/core/config/query-client";
import { secureStorage } from "@/core/data/storage/secure-storage";
import { ErrorBoundary } from "@/core/presentation/components/error-boundary";
import { ErrorFallback } from "@/core/presentation/components/error-fallback";
import { SplashGate } from "@/core/presentation/components/splash-gate";
import { initializeStorage } from "@/core/presentation/store/storage";
import { createSupabaseAuthRepository } from "@/features/auth/data/repositories/supabase-auth-repository";
import { useAuthInit } from "@/features/auth/presentation/hooks/use-auth-init";
import { useAuthentication } from "@/features/auth/presentation/hooks/use-authentication";
import { initializeAuthRepository } from "@/features/auth/presentation/store/auth-repository";
import { initializeAuthStore } from "@/features/auth/presentation/store/auth-store";
import { createSupabaseProfileRepository } from "@/features/profile/data/repositories/supabase-profile-repository";
import { initializeProfileRepository } from "@/features/profile/presentation/store/profile-repository";
import {
  initializeSentry,
  navigationIntegration,
} from "@/infrastructure/monitoring/sentry/client";
import { supabaseClient } from "@/infrastructure/supabase/client";

import "@/i18n";

initializeSentry();
initializeStorage(secureStorage);

const authRepository = createSupabaseAuthRepository(supabaseClient);
const profileRepository = createSupabaseProfileRepository(supabaseClient);

initializeAuthRepository(authRepository);
initializeAuthStore(authRepository);
initializeProfileRepository(profileRepository);

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
  useAuthInit();

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
