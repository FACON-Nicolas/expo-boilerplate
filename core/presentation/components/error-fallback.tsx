import { useTranslation } from 'react-i18next';

import { Button } from '@/ui/components/button';
import { SafeAreaView } from '@/ui/components/safe-area-view';
import { Text } from '@/ui/components/text';
import { View } from '@/ui/components/view';
import { useThemeColors } from '@/ui/theme/use-theme-colors';

import type { ErrorBoundaryFallbackProps } from '@/core/presentation/components/error-boundary';

export function ErrorFallback({ error, onRetry }: ErrorBoundaryFallbackProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 24 }}>
      <View style={{ alignItems: 'center', gap: 16 }}>
        <Text variant="title">{t('errorBoundary.title')}</Text>
        <Text style={{ textAlign: 'center', color: colors.placeholder }}>
          {t('errorBoundary.description')}
        </Text>
        {__DEV__ && (
          <Text variant="error" style={{ textAlign: 'center', fontSize: 14 }}>
            {error.message}
          </Text>
        )}
      </View>
      <Button onPress={onRetry}>{t('errorBoundary.retryButton')}</Button>
    </SafeAreaView>
  );
}
