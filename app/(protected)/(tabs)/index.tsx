import { useTranslation } from 'react-i18next';

import { SafeAreaView } from '@/ui/components/safe-area-view';
import { Text } from '@/ui/components/text';

export default function Index() {
  const { t } = useTranslation();
  return (
    <SafeAreaView>
      <Text>{t('home.title')}</Text>
    </SafeAreaView>
  );
}
