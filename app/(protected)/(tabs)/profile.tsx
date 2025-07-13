import { ThemedButton } from '@/components/themed-button';
import ThemedSafeAreaView from '@/components/themed-safe-area-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/store/auth';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

export default function Profile() {
  const { t } = useTranslation();
  const { signOut } = useAuth();

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedText>{t('profile.title')}</ThemedText>
      <ThemedButton onPress={signOut} variant='error'>
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
