import { Link as ExpoLink } from 'expo-router';
import { StyleSheet } from 'react-native';

import { useThemeColors } from '@/ui/theme/use-theme-colors';

import type { LinkProps as ExpoLinkProps } from 'expo-router';

export function Link({ style, ...props }: ExpoLinkProps) {
  const colors = useThemeColors();
  return (
    <ExpoLink
      style={[styles.base, { color: colors.link }, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
  },
});
