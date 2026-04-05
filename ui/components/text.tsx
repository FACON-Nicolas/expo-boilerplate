import { Text as RNText, StyleSheet } from 'react-native';

import { useThemeColors } from '@/ui/theme/use-theme-colors';

import type { TextProps as RNTextProps } from 'react-native';

type TextVariant = 'default' | 'title' | 'subtitle' | 'semibold' | 'link' | 'error';

type TextProps = RNTextProps & {
  variant?: TextVariant;
};

export function Text({ variant = 'default', style, ...props }: TextProps) {
  const colors = useThemeColors();

  const variantColor = variant === 'link'
    ? colors.link
    : variant === 'error'
      ? colors.error
      : colors.text;

  return (
    <RNText
      style={[styles.base, { color: variantColor }, styles[variant], style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
  },
  default: {
    lineHeight: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 25,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  semibold: {
    fontWeight: '600',
    lineHeight: 28,
  },
  link: {
    lineHeight: 28,
  },
  error: {
    fontSize: 14,
  },
});
