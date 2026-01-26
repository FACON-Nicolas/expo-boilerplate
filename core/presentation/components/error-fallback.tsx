import { useTranslation } from 'react-i18next';

import { Button } from '@/ui/components/button';
import { SafeAreaView } from '@/ui/components/safe-area-view';
import { Text } from '@/ui/components/text';
import { View } from '@/ui/components/view';

import type { ErrorBoundaryFallbackProps } from '@/core/presentation/components/error-boundary';

export function ErrorFallback({ error, onRetry }: ErrorBoundaryFallbackProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 justify-center items-center p-6 gap-6">
      <View className="items-center gap-4">
        <Text variant="title">{t('errorBoundary.title')}</Text>
        <Text className="text-center text-default-500">
          {t('errorBoundary.description')}
        </Text>
        {__DEV__ && (
          <Text variant="error" className="text-center text-sm">
            {error.message}
          </Text>
        )}
      </View>
      <Button onPress={onRetry}>{t('errorBoundary.retryButton')}</Button>
    </SafeAreaView>
  );
}
