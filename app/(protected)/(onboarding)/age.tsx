import { SafeAreaView } from '@/ui/components/safe-area-view';
import { Text } from '@/ui/components/text';
import { Button } from '@/ui/components/button';
import { View } from '@/ui/components/view';
import { RadioGroup } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { useOnboarding } from '@/features/onboarding/presentation/context/onboarding-context';
import { useCreateProfile } from '@/features/profile/presentation/hooks/use-create-profile';
import { useAuth } from '@/features/auth/presentation/hooks/use-auth';
import type { AgeRange } from '@/features/profile/domain/entities/profile';

const AGE_RANGES: AgeRange[] = ['18-24', '25-34', '35+'];

export default function AgeScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: onboardingData, setAgeRange, reset } = useOnboarding();
  const { mutate: createProfile, isPending } = useCreateProfile();

  const onValueChange = (value: string) => {
    setAgeRange(value as AgeRange);
  };

  const onPressFinish = () => {
    if (!onboardingData.ageRange) return;

    createProfile(
      {
        profile: {
          firstname: onboardingData.firstname,
          lastname: onboardingData.lastname,
          ageRange: onboardingData.ageRange,
        },
        userId: user?.id ?? '',
      },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  return (
    <SafeAreaView>
      <View className="flex-1 mt-8 items-center px-5 gap-5 justify-between">
        <View className="gap-5 w-full">
          <Text variant='title' className="text-center">
            {t('onboarding.age.title')}
          </Text>
          <Text className="text-center">
            {t('onboarding.age.subtitle')}
          </Text>
          <RadioGroup
            value={onboardingData.ageRange ?? ''}
            onValueChange={onValueChange}
          >
            {AGE_RANGES.map((age) => (
              <RadioGroup.Item key={age} value={age}>
                <RadioGroup.Label>{age}</RadioGroup.Label>
                <RadioGroup.Indicator />
              </RadioGroup.Item>
            ))}
          </RadioGroup>
        </View>
        <Button
          onPress={onPressFinish}
          disabled={!onboardingData.ageRange}
          isLoading={isPending}
        >
          {t('onboarding.age.next')}
        </Button>
      </View>
    </SafeAreaView>
  );
}
