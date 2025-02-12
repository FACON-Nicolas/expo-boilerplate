import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { TextStyle } from 'react-native';
import { StyleProp } from 'react-native';

export function ThemedIcon({
  name,
  size = 24,
  color,
  style,
}: {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}) {
  const iconColor = useThemeColor({}, 'icon');
  return (
    <Ionicons
      name={name}
      size={size}
      color={color || iconColor}
      style={style}
    />
  );
}
