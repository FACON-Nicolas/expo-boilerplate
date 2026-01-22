import { Stack } from 'expo-router';
import { OnboardingProvider } from '@/features/onboarding/presentation/context/onboarding-context';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' />
        <Stack.Screen name='identity' />
        <Stack.Screen name='age' />
      </Stack>
    </OnboardingProvider>
  );
}
