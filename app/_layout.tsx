import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import '@/i18n';
import { useAuthentication } from '@/hooks/useAuthentication';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  const scheme = useColorScheme();

  const { isUserAuthenticated } = useAuthentication();

  return (
    <QueryClientProvider client={queryClient}>
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
