import { TextField } from "heroui-native";
import { useTranslation } from "react-i18next";
import { AccessibilityInfo, Pressable, type TextInputProps } from "react-native";

import { Icon } from "@/ui/components/icon";
import { View } from "@/ui/components/view";
import { useToggle } from "@/ui/hooks/use-toggle";

type InputProps = TextInputProps & {
  secureTextEntry?: boolean;
  label?: string;
  errorMessage?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

export function Input({
  secureTextEntry,
  label,
  errorMessage,
  accessibilityLabel,
  accessibilityHint,
  ...props
}: InputProps) {
  const { t } = useTranslation();
  const [isPasswordVisible, togglePasswordVisibility] = useToggle(false);
  const isSecure = secureTextEntry && !isPasswordVisible;

  const onPressPasswordToggle = () => {
    togglePasswordVisibility();
    const announcement = isPasswordVisible
      ? t('accessibility.input.passwordHidden')
      : t('accessibility.input.passwordVisible');
    AccessibilityInfo.announceForAccessibility(announcement);
  };

  const passwordToggleLabel = isPasswordVisible
    ? t('accessibility.input.hidePassword')
    : t('accessibility.input.showPassword');

  return (
    <TextField isInvalid={!!errorMessage} className='w-full'>
      {label && <TextField.Label>{label}</TextField.Label>}
      <View className='relative'>
        <TextField.Input
          {...props}
          keyboardType='default'
          key={isSecure ? "secure" : "visible"}
          className='rounded-md bg-input-background p-4'
          autoCapitalize={"none"}
          secureTextEntry={isSecure}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={accessibilityHint}
          accessibilityState={{ disabled: props.editable === false }}
        />
        {secureTextEntry && (
          <Pressable
            onPress={onPressPasswordToggle}
            className='absolute right-4 top-1/2 -translate-y-1/2'
            accessibilityRole="button"
            accessibilityLabel={passwordToggleLabel}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Icon
              name={isPasswordVisible ? "eye-off" : "eye"}
              accessibilityElementsHidden
            />
          </Pressable>
        )}
      </View>
      {errorMessage && (
        <TextField.ErrorMessage accessibilityLiveRegion="polite">
          {errorMessage}
        </TextField.ErrorMessage>
      )}
    </TextField>
  );
}
