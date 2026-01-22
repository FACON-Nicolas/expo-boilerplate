import { Ionicons } from '@expo/vector-icons';

type IconProps = {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  className?: string;
};

export function Icon({ name, size = 24, color, className }: IconProps) {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
      className={className ?? 'text-icon'}
    />
  );
}
