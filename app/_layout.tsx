import "@/global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Uniwind } from "uniwind";

import { AppError } from "@/core/domain/errors/app-error";
import { useAuthentication } from "@/features/auth/presentation/hooks/use-authentication";
import { useThemeStore } from "@/ui/theme/theme-store";

import "@/i18n";

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;
const MAX_RETRIES = 3;
const NO_RETRY_ERROR_CODES = ["PGRST116", "42501"];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      retry: (failureCount, error: unknown) => {
        if (
          AppError.hasCode(error) &&
          NO_RETRY_ERROR_CODES.includes(error.code)
        ) {
          return false;
        }
        return failureCount < MAX_RETRIES;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    },
  },
});

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

function RootLayoutContent() {
  const mode = useThemeStore((state) => state.mode);

  useEffect(() => {
    Uniwind.setTheme(mode);
  }, [mode]);

  return (
    <HeroUINativeProvider>
      <NavigationStack />
    </HeroUINativeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar translucent />
        <RootLayoutContent />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
