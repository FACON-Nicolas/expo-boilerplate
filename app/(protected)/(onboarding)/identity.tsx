import { Input } from '@/ui/components/input';
import { SafeAreaView } from '@/ui/components/safe-area-view';
import { Text } from '@/ui/components/text';
import { Button } from '@/ui/components/button';
import { View } from '@/ui/components/view';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOnboarding } from '@/features/onboarding/presentation/context/onboarding-context';
import { router } from 'expo-router';
import type { Identity } from '@/features/onboarding/domain/entities/onboarding-data';

export default function IdentityScreen() {
  const { t } = useTranslation();
  const { data, setIdentity, isValidIdentity } = useOnboarding();
  const [identity, setIdentityForm] = useState<Identity>({
    firstname: data.firstname,
    lastname: data.lastname,
  });

  const onFieldChange = (field: keyof Identity, value: string) => {
    setIdentityForm((prev) => ({ ...prev, [field]: value }));
  };

  const onPressNext = () => {
    setIdentity(identity);
    router.push('/age');
  };

  return (
    <SafeAreaView>
      <View className="flex-1 mt-8 items-center px-5 gap-5 justify-between">
        <View className="gap-5">
          <Text variant='title' className="text-center">
            {t('onboarding.identity.title')}
          </Text>
          <Text className="text-center">
            {t('onboarding.identity.subtitle')}
          </Text>
          <View className="gap-2.5 w-full">
            <Input
              value={identity.firstname}
              placeholder={t('onboarding.identity.firstname')}
              autoCorrect={false}
              onChangeText={(value) => onFieldChange('firstname', value)}
            />
            <Input
              value={identity.lastname}
              placeholder={t('onboarding.identity.lastname')}
              autoCorrect={false}
              onChangeText={(value) => onFieldChange('lastname', value)}
            />
          </View>
        </View>
        <Button onPress={onPressNext} disabled={!isValidIdentity(identity)}>
          {t('onboarding.identity.next')}
        </Button>
      </View>
    </SafeAreaView>
  );
}
