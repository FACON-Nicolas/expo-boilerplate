import { useToast } from 'heroui-native';
import { useTranslation } from 'react-i18next';

import type { AppError, AppErrorCode } from '@/core/domain/errors/app-error';

type ToastVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger';

const ERROR_CODE_TO_VARIANT: Record<AppErrorCode, ToastVariant> = {
  UNKNOWN: 'danger',
  VALIDATION: 'warning',
  NETWORK: 'danger',
  UNAUTHORIZED: 'warning',
  NOT_FOUND: 'warning',
  CONFLICT: 'warning',
};

export function useAppToast() {
  const { toast } = useToast();
  const { t } = useTranslation();

  const showError = (error: AppError) => {
    const translatedMessage = t(`errors.api.${error.code}`, {
      defaultValue: error.message,
    });

    toast.show({
      label: t('toast.errorTitle'),
      description: translatedMessage,
      variant: ERROR_CODE_TO_VARIANT[error.code],
      duration: 4000,
    });
  };

  const showSuccess = (messageKey: string) => {
    toast.show({
      label: t(messageKey),
      variant: 'success',
      duration: 3000,
    });
  };

  return { showError, showSuccess };
}
