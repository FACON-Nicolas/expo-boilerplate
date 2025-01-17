import { Redirect, Stack } from 'expo-router';
import { useAuthenticationManagement } from '@/hooks/useAuthenticationManagement';

export default function RootLayout() {
  const { isUserAuthenticated, isUserLoading } = useAuthenticationManagement();

  if (isUserLoading) return null;

  if (!isUserAuthenticated) {
    return <Redirect href='/(public)' />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
    </Stack>
  );
}
