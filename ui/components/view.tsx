import { View as RNView, type ViewProps as RNViewProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

type ViewProps = RNViewProps & {
  className?: string;
};

export function View({ className, ...props }: ViewProps) {
  return <RNView className={twMerge('bg-background', className)} {...props} />;
}
