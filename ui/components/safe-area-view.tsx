import { Platform } from "react-native";
import {
  SafeAreaView as RNSafeAreaView,
  type SafeAreaViewProps,
} from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";
import { withUniwind } from "uniwind";

const StyledSafeAreaView = withUniwind(RNSafeAreaView);

type SafeViewProps = SafeAreaViewProps & {
  className?: string;
};

export function SafeAreaView({ className, ...props }: SafeViewProps) {
  return (
    <StyledSafeAreaView
      className={twMerge(
        "flex-1 bg-background",
        Platform.select({
          android: "pb-safe-offset-12",
          ios: "pb-safe-offset-0",
        }),
        className,
      )}
      edges={props.edges ?? ["bottom", "top", "left", "right"]}
      {...props}
    />
  );
}
