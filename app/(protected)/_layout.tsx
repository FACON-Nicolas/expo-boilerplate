import { Stack } from 'expo-router';
import { useAuthentication } from '@/hooks/useAuthentication';
import { useFetchProfile } from '@/hooks/queries/useFetchProfile';

export default function RootLayout() {
  const { isUserLoading } = useAuthentication();
  const { data: profile, isLoading: isProfileLoading } = useFetchProfile();

  if (isUserLoading || isProfileLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!profile}>
        <Stack.Screen name='(onboarding)' />
      </Stack.Protected>
      <Stack.Protected guard={!!profile}>
        <Stack.Screen name='(tabs)' />
      </Stack.Protected>
    </Stack>
  );
}
