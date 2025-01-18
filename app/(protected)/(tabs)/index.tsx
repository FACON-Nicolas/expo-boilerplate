import ThemedSafeAreaView from '@/components/ThemedSafeAreaView';
import { ThemedText } from '@/components/ThemedText';
import { useTranslation } from 'react-i18next';

export default function Index() {
  const { t } = useTranslation();
  return (
    <ThemedSafeAreaView>
      <ThemedText>{t('home.title')}</ThemedText>
    </ThemedSafeAreaView>
  );
}
