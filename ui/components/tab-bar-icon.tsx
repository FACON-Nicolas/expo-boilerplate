import { Ionicons } from '@expo/vector-icons';

type TabBarIconProps = {
  name: 'home' | 'person';
  color: string;
  focused: boolean;
};

export function TabBarIcon({ name, color, focused }: TabBarIconProps) {
  return (
    <Ionicons
      name={focused ? name : `${name}-outline`}
      size={24}
      color={color}
    />
  );
}
