import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

import { useThemeColors } from '@/ui/theme/use-theme-colors';

import type { SafeAreaViewProps } from 'react-native-safe-area-context';

export function SafeAreaView({ style, edges, ...props }: SafeAreaViewProps) {
  const colors = useThemeColors();
  return (
    <RNSafeAreaView
      style={[{ flex: 1, backgroundColor: colors.background, paddingBottom: 12 }, style]}
      edges={edges ?? ['bottom', 'top', 'left', 'right']}
      {...props}
    />
  );
}
