import { View as RNView } from 'react-native';

import { useThemeColors } from '@/ui/theme/use-theme-colors';

import type { ViewProps as RNViewProps } from 'react-native';

export function View({ style, ...props }: RNViewProps) {
  const colors = useThemeColors();
  return (
    <RNView
      style={[{ backgroundColor: colors.background }, style]}
      {...props}
    />
  );
}
