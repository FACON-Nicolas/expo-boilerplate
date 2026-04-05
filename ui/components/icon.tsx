import { Ionicons } from '@expo/vector-icons';

import { useThemeColors } from '@/ui/theme/use-theme-colors';

type IconProps = {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  accessibilityLabel?: string;
  accessibilityElementsHidden?: boolean;
};

export function Icon({
  name,
  size = 24,
  color,
  accessibilityLabel,
  accessibilityElementsHidden = !accessibilityLabel,
}: IconProps) {
  const colors = useThemeColors();
  return (
    <Ionicons
      name={name}
      size={size}
      color={color ?? colors.icon}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityElementsHidden={accessibilityElementsHidden}
      importantForAccessibility={accessibilityElementsHidden ? 'no-hide-descendants' : 'auto'}
    />
  );
}
