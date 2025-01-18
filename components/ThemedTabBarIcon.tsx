import { Ionicons } from '@expo/vector-icons';

export function ThemedTabBarIcon({
  name,
  color,
  focused,
}: {
  name: 'home' | 'person';
  color: string;
  focused: boolean;
}) {
  return (
    <Ionicons
      name={focused ? name : `${name}-outline`}
      size={24}
      color={color}
    />
  );
}
