import { Button as HeroUIButton, Spinner } from 'heroui-native';

import type { PressableProps } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

type ButtonProps = PressableProps & {
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
  ...props
}: ButtonProps) {
  return (
    <HeroUIButton
      variant={variant}
      size={size}
      isDisabled={disabled || isLoading}
      className="w-full"
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
