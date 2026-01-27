import { Text } from 'react-native';

type IconProps = {
  name: string;
  accessibilityLabel?: string;
  accessibilityElementsHidden?: boolean;
};

export function Icon({ name }: IconProps) {
  return <Text testID={`icon-${name}`}>{name}</Text>;
}
