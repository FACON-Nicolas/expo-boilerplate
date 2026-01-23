import { Stack } from 'expo-router';
import { useAuthentication } from '@/features/auth/presentation/hooks/use-authentication';
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

  if (isUserLoading) return <LoadingSkeleton />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='(tabs)' />
    </Stack>
  );
}
