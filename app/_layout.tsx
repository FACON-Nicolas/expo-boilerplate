import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import '@/i18n';
import { useAuthentication } from '@/hooks/useAuthentication';

export default function RootLayout() {
  const scheme = useColorScheme();

  const { isUserAuthenticated } = useAuthentication();
  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} initialRouteName='(public)'>
        <Stack.Protected guard={isUserAuthenticated}>
          <Stack.Screen name='(protected)' />
        </Stack.Protected>
        <Stack.Protected guard={!isUserAuthenticated}>
          <Stack.Screen name='(public)' />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
