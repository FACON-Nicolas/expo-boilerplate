import { View as RNView } from 'react-native';

import type { ReactNode } from 'react';
import type { ViewProps as RNViewProps } from 'react-native';

type ViewProps = RNViewProps & {
  children?: ReactNode;
};

export function View({ children, ...props }: ViewProps) {
  return <RNView {...props}>{children}</RNView>;
}
