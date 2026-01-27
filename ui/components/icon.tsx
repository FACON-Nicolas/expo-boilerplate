import { Ionicons } from '@expo/vector-icons';

type IconProps = {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  className?: string;
  accessibilityLabel?: string;
  accessibilityElementsHidden?: boolean;
};

export function Icon({
  name,
  size = 24,
  color,
  className,
  accessibilityLabel,
  accessibilityElementsHidden = !accessibilityLabel,
}: IconProps) {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
      className={className ?? 'text-icon'}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityElementsHidden={accessibilityElementsHidden}
      importantForAccessibility={accessibilityElementsHidden ? 'no-hide-descendants' : 'auto'}
    />
  );
}
