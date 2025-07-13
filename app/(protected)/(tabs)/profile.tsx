import { ThemedButton } from '@/components/themed-button';
import ThemedSafeAreaView from '@/components/themed-safe-area-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/store/auth';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

export default function Profile() {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const queryClient = useQueryClient();

  const onSignOut = async () => {
    try {
      await signOut();
      await queryClient.clear();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedText>{t('profile.title')}</ThemedText>
      <ThemedButton onPress={onSignOut} variant='error'>
        {t('profile.signOut')}
      </ThemedButton>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 10,
  },
});
