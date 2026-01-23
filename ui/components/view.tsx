import { View as RNView, ViewProps as RNViewProps } from "react-native";
import { twMerge } from "tailwind-merge";
import { withUniwind } from "uniwind";

const StyledView = withUniwind(RNView);

type ViewProps = RNViewProps & {
  className?: string;
};

export function View({ className, ...props }: ViewProps) {
  return (
    <StyledView className={twMerge("bg-background", className)} {...props} />
  );
}
