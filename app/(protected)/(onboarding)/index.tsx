import { SafeAreaView } from '@/ui/components/safe-area-view';
import { Text } from '@/ui/components/text';
import { View } from '@/ui/components/view';
import { Button } from '@/ui/components/button';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

const ANIMATION_SIZE = 200;

export default function Index() {
  const onPressStart = () => router.replace('/identity');
  const { t } = useTranslation();

  return (
    <SafeAreaView className="px-6 justify-between items-center">
      <View className="gap-6 items-center flex-1 justify-center">
        <LottieView
          source={require('@/assets/animations/start-onboarding.json')}
          autoPlay
          loop
          style={{ width: ANIMATION_SIZE, height: ANIMATION_SIZE }}
        />
        <Text variant='title' className="text-center leading-7">
          {t('onboarding.welcome.title')}
        </Text>
        <Text className="text-center leading-6">
          {t('onboarding.welcome.body')}
        </Text>
        <Text className="text-center text-sm opacity-80">
          {t('onboarding.welcome.ps')}
        </Text>
      </View>
      <Button onPress={onPressStart}>
        {t('onboarding.welcome.button')}
      </Button>
    </SafeAreaView>
  );
}
