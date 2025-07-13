import ThemedSafeAreaView from '@/components/themed-safe-area-view';
import { ThemedText } from '@/components/themed-text';
import { useTranslation } from 'react-i18next';

export default function Index() {
  const { t } = useTranslation();
  return (
    <ThemedSafeAreaView>
      <ThemedText>{t('home.title')}</ThemedText>
    </ThemedSafeAreaView>
  );
}
