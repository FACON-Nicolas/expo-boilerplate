import { Redirect, Stack } from 'expo-router';
import { useResetAuthError } from '@/hooks/useResetAuthError';
import { useAuthenticationManagement } from '@/hooks/useAuthenticationManagement';

export default function RootLayout() {
  const { isUserAuthenticated } = useAuthenticationManagement();
  useResetAuthError();

  if (isUserAuthenticated) {
    return <Redirect href='/(protected)' />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='sign-up' />
    </Stack>
  );
}
