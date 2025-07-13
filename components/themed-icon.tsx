import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

export function ThemedIcon({
  name,
  size = 24,
  color,
}: {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
}) {
  const iconColor = useThemeColor({}, 'icon');
  return <Ionicons name={name} size={size} color={color || iconColor} />;
}
