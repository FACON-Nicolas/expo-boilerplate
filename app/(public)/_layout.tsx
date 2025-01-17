import { selectAuthState } from '@/redux/auth';
import { useAppSelector } from '@/redux/store';
import { Redirect, Stack } from 'expo-router';
import { useResetAuthError } from '@/hooks/useResetAuthError';

export default function RootLayout() {
  const { user } = useAppSelector(selectAuthState);
  useResetAuthError();

  if (!!user) {
    return <Redirect href='/(protected)' />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='sign-up' />
    </Stack>
  );
}
