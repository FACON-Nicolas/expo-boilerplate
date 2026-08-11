import { Host, TextInput as ComposeTextInput } from '@expo/ui';
import { useTranslation } from 'react-i18next';
import { AccessibilityInfo, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/ui/components/icon';
import { useToggle } from '@/ui/hooks/use-toggle';
import { useThemeColors } from '@/ui/theme/use-theme-colors';

import type { TextInputProps } from 'react-native';

type AndroidKeyboardType = 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'ascii-capable' | 'url' | 'decimal-pad' | 'password';

type InputProps = TextInputProps & {
  secureTextEntry?: boolean;
  label?: string;
  errorMessage?: string;
};

export function Input({
  secureTextEntry,
  label,
  errorMessage,
  value,
  onChangeText,
  keyboardType,
}: InputProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
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

  const resolvedKeyboardType: AndroidKeyboardType = isSecure ? 'password' : (keyboardType as AndroidKeyboardType) ?? 'default';

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <View style={styles.inputRow}>
        <Host style={styles.host}>
          <ComposeTextInput
            defaultValue={value}
            keyboardType={resolvedKeyboardType as 'default'}
            onChangeText={onChangeText as (value: string) => void}
            autoCorrect={false}
          />
        </Host>
        {secureTextEntry && (
          <Pressable
            onPress={onPressPasswordToggle}
            style={styles.eyeButton}
            accessibilityRole="button"
            accessibilityLabel={passwordToggleLabel}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Icon
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              accessibilityElementsHidden
            />
          </Pressable>
        )}
      </View>
      {errorMessage && (
        <Text
          style={[styles.error, { color: colors.error }]}
          accessibilityLiveRegion="polite"
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputRow: {
    position: 'relative',
  },
  host: {
    height: 56,
    borderRadius: 8,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  error: {
    fontSize: 14,
  },
});
