import {
  Host,
  Button as ComposeButton,
  OutlinedButton,
  TextButton,
  CircularProgressIndicator,
  Text as ComposeText,
} from '@expo/ui/jetpack-compose';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useThemeColors } from '@/ui/theme/use-theme-colors';

import type { PressableProps, AccessibilityProps } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

type ButtonProps = PressableProps &
  AccessibilityProps & {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
  };

export function Button({
  children,
  variant = 'primary',
  size: _size = 'md',
  isLoading = false,
  disabled,
  accessibilityLabel,
  onPress,
}: ButtonProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const isDisabled = disabled || isLoading;

  const label = typeof children === 'string'
    ? children
    : accessibilityLabel ?? t('accessibility.button.loading');

  if (isLoading) {
    return (
      <View style={{ width: '100%', height: 48, alignItems: 'center', justifyContent: 'center' }}>
        <Host matchContents>
          <CircularProgressIndicator />
        </Host>
      </View>
    );
  }

  const sharedProps = {
    onClick: onPress as () => void,
    enabled: !isDisabled,
  };

  const content = <ComposeText style={{ fontWeight: 'bold' }}>{label.toUpperCase()}</ComposeText>;

  if (variant === 'secondary') {
    return (
      <Host style={{ width: '100%', height: 48 }} useViewportSizeMeasurement>
        <OutlinedButton {...sharedProps}>{content}</OutlinedButton>
      </Host>
    );
  }

  if (variant === 'ghost') {
    return (
      <Host style={{ width: '100%', height: 48 }} useViewportSizeMeasurement>
        <TextButton {...sharedProps}>{content}</TextButton>
      </Host>
    );
  }

  if (variant === 'danger') {
    return (
      <Host style={{ width: '100%', height: 48 }} useViewportSizeMeasurement>
        <ComposeButton
          {...sharedProps}
          colors={{ containerColor: colors.error, contentColor: '#ffffff' }}
        >
          {content}
        </ComposeButton>
      </Host>
    );
  }

  return (
    <Host style={{ width: '100%', height: 48 }} useViewportSizeMeasurement>
      <ComposeButton
        {...sharedProps}
        colors={{ containerColor: colors.tint, contentColor: '#ffffff' }}
      >
        {content}
      </ComposeButton>
    </Host>
  );
}
