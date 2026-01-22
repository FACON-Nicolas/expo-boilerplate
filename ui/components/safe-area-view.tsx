import {
  SafeAreaView as RNSafeAreaView,
  type SafeAreaViewProps,
} from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

type SafeViewProps = SafeAreaViewProps & {
  className?: string;
};

export function SafeAreaView({ className, ...props }: SafeViewProps) {
  return (
    <RNSafeAreaView
      className={twMerge('flex-1 bg-background', className)}
      {...props}
    />
  );
}
