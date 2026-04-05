import { useColorScheme } from 'react-native';

import { Colors } from '@/ui/theme/colors';
import { useThemeStore } from '@/ui/theme/theme-store';

export function useThemeColors() {
  const systemScheme = useColorScheme();
  const mode = useThemeStore((state) => state.mode);
  const resolved: 'light' | 'dark' = mode === 'system'
    ? (systemScheme === 'dark' ? 'dark' : 'light')
    : mode;
  return Colors[resolved];
}
