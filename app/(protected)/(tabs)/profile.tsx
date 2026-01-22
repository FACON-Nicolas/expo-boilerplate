import { Button } from '@/ui/components/button';
import { SafeAreaView } from '@/ui/components/safe-area-view';
import { Text } from '@/ui/components/text';
import { View } from '@/ui/components/view';
import { useAuth } from '@/features/auth/presentation/hooks/use-auth';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { createSupabaseAuthRepository } from '@/features/auth/data/repositories/supabase-auth-repository';
import { supabaseClient } from '@/infrastructure/supabase/client';

export default function Profile() {
  const { t } = useTranslation();
  const { signOut, user } = useAuth();
  const queryClient = useQueryClient();

  const authRepository = createSupabaseAuthRepository(supabaseClient);

  const onPressSignOut = async () => {
    try {
      await authRepository.signOut();
      signOut();
      await queryClient.invalidateQueries({
        queryKey: ['profile', user?.id],
      });
    } catch (error) {
      console.error(error);
    }
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
