import { Text } from 'react-native';

type IconProps = {
  name: string;
};

export function Icon({ name }: IconProps) {
  return <Text testID={`icon-${name}`}>{name}</Text>;
}
