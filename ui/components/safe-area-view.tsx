import {
  SafeAreaView as RNSafeAreaView,
  type SafeAreaViewProps,
} from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { twMerge } from 'tailwind-merge';

const StyledSafeAreaView = withUniwind(RNSafeAreaView);

type SafeViewProps = SafeAreaViewProps & {
  className?: string;
};

export function SafeAreaView({ className, ...props }: SafeViewProps) {
  return (
    <StyledSafeAreaView
      className={twMerge('flex-1 bg-background', className)}
      {...props}
    />
  );
}
