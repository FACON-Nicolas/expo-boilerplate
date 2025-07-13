import { Stack } from 'expo-router';
import { useAuthentication } from '@/hooks/useAuthentication';

export default function RootLayout() {
  const { isUserLoading } = useAuthentication();

  if (isUserLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='(tabs)' />
    </Stack>
  );
}
