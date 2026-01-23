import { View as RNView } from "react-native";
import { twMerge } from "tailwind-merge";
import { withUniwind } from "uniwind";

import type { ViewProps as RNViewProps } from "react-native";

const StyledView = withUniwind(RNView);

type ViewProps = RNViewProps & {
  className?: string;
};

export function View({ className, ...props }: ViewProps) {
  return (
    <StyledView className={twMerge("bg-background", className)} {...props} />
  );
}
