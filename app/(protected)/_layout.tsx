import { Stack } from 'expo-router';
import { useAuthentication } from '@/features/auth/presentation/hooks/use-authentication';
import { useFetchProfile } from '@/features/profile/presentation/hooks/use-fetch-profile';
import { SafeAreaView } from '@/ui/components/safe-area-view';
import { Skeleton, SkeletonGroup } from '@/ui/components/skeleton';

function LoadingSkeleton() {
  return (
    <SafeAreaView className="p-6 gap-4">
      <SkeletonGroup>
        <Skeleton variant="title" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="input" />
        <Skeleton variant="input" />
        <Skeleton variant="button" />
      </SkeletonGroup>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const { isUserLoading } = useAuthentication();
  const { data: profile, isLoading: isProfileLoading } = useFetchProfile();

  if (isUserLoading || isProfileLoading) return <LoadingSkeleton />;

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
