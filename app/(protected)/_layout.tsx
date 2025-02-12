import { Stack } from 'expo-router';
import { useAuthenticationManagement } from '@/hooks/useAuthenticationManagement';

export default function RootLayout() {
  const { isUserLoading } = useAuthenticationManagement();

  if (isUserLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='(tabs)' />
    </Stack>
  );
}
