import { Button as HeroUIButton, Spinner } from 'heroui-native';
import { useTranslation } from 'react-i18next';

import type { AccessibilityProps, PressableProps } from 'react-native';

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
  size = 'md',
  isLoading = false,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  ...props
}: ButtonProps) {
  const { t } = useTranslation();
  const isDisabled = disabled || isLoading;

  const loadingLabel = t('accessibility.button.loading');
  const computedLabel = isLoading
    ? loadingLabel
    : accessibilityLabel ?? (typeof children === 'string' ? children : undefined);

  return (
    <HeroUIButton
      variant={variant}
      size={size}
      isDisabled={isDisabled}
      className="w-full"
      accessibilityRole="button"
      accessibilityLabel={computedLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled }}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <HeroUIButton.Label className="uppercase font-bold">
          {children}
        </HeroUIButton.Label>
      )}
    </HeroUIButton>
  );
}
