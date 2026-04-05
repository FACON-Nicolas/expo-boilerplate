import {
  Host,
  Button as SwiftButton,
  ProgressView,
  Text,
} from "@expo/ui/swift-ui";
import {
  buttonStyle,
  tint,
  disabled as disabledModifier,
  frame,
  foregroundStyle,
} from "@expo/ui/swift-ui/modifiers";
import { useTranslation } from "react-i18next";

import { useThemeColors } from "@/ui/theme/use-theme-colors";

import type { PressableProps, AccessibilityProps } from "react-native";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = PressableProps &
  AccessibilityProps & {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
  };

const STYLE_MAP: Record<
  ButtonVariant,
  "borderedProminent" | "bordered" | "borderless"
> = {
  primary: "borderedProminent",
  secondary: "bordered",
  danger: "bordered",
  ghost: "borderless",
};

export function Button({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  accessibilityLabel,
  onPress = () => {},
}: ButtonProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const isDisabled = disabled || isLoading;

  const label = isLoading
    ? t("accessibility.button.loading")
    : (accessibilityLabel ?? (typeof children === "string" ? children : ""));

  const modifiers = [
    buttonStyle(STYLE_MAP[variant]),
    frame({ maxWidth: 99999, height: 60 }),
  ];

  const disabledModifiers = isDisabled ? [disabledModifier()] : [];

  const variantModifiers: Record<ButtonVariant, ReturnType<typeof tint>> = {
    primary: tint(colors.primary),
    secondary: tint(colors.background),
    danger: tint(colors.error),
    ghost: tint(colors.primary),
  };

  return (
    <Host style={{ width: "100%", height: 60 }} useViewportSizeMeasurement>
      {isLoading ? (
        <ProgressView />
      ) : (
        <SwiftButton
          modifiers={[
            ...modifiers,
            ...disabledModifiers,
            variantModifiers[variant],
          ]}
          onPress={onPress as () => void}
        >
          <Text
            modifiers={[
              frame({ minHeight: 36, maxWidth: Infinity }),
              foregroundStyle(colors.background),
            ]}
          >
            {label}
          </Text>
        </SwiftButton>
      )}
    </Host>
  );
}
