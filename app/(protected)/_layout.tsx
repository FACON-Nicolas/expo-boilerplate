import { Redirect, Stack } from 'expo-router';
import { useAppSelector } from '@/redux/store';
import { selectAuthState } from '@/redux/auth';

export default function RootLayout() {
  const { user } = useAppSelector(selectAuthState);

  if (!user) {
    return <Redirect href='/(public)' />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
    </Stack>
  );
}
