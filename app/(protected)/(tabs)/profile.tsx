import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/features/auth/presentation/hooks/use-auth';
import { Button } from '@/ui/components/button';
import { SafeAreaView } from '@/ui/components/safe-area-view';
import { Text } from '@/ui/components/text';
import { View } from '@/ui/components/view';

export default function Profile() {
  const { t } = useTranslation();
  const { signOut, user } = useAuth();
  const queryClient = useQueryClient();

  const onPressSignOut = async () => {
    await signOut();
    await queryClient.invalidateQueries({
      queryKey: ['profile', user?.id],
    });
  };

  return (
    <SafeAreaView className="px-5 gap-2.5">
      <Text>{t('profile.title')}</Text>

      <View className="mt-auto">
        <Button onPress={onPressSignOut} variant='danger'>
          {t('profile.signOut')}
        </Button>
      </View>
    </SafeAreaView>
  );
}
