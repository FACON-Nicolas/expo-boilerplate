import { ThemedIcon } from './ThemedIcon';

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
    <ThemedIcon
      name={focused ? name : `${name}-outline`}
      size={24}
      color={color}
    />
  );
}
