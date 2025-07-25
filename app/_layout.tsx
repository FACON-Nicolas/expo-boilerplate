import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar, useColorScheme } from 'react-native';
import '@/i18n';
import { useAuthentication } from '@/hooks/useAuthentication';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;
const MAX_RETRIES = 3;
const NO_RETRY_ERROR_CODES = ['PGRST116', '42501'];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      retry: (failureCount, error: any) => {
        if (NO_RETRY_ERROR_CODES.includes(error?.code)) return false;
        return failureCount < MAX_RETRIES;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

export default function RootLayout() {
  const scheme = useColorScheme();

  const { isUserAuthenticated } = useAuthentication();

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar translucent />
      <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={isUserAuthenticated}>
            <Stack.Screen name='(protected)' />
          </Stack.Protected>
          <Stack.Protected guard={!isUserAuthenticated}>
            <Stack.Screen name='(public)' />
          </Stack.Protected>
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
