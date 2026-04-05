import { Pressable, Text, TextInput, View } from 'react-native';

import type { ReactNode } from 'react';

type HostProps = {
  children: ReactNode;
  style?: object;
  matchContents?: boolean | object;
};

function Host({ children, style }: HostProps) {
  return <View style={style}>{children}</View>;
}

type ButtonProps = {
  children?: ReactNode;
  onClick?: () => void;
  enabled?: boolean;
  colors?: object;
  modifiers?: unknown[];
};

function Button({ children, onClick, enabled = true }: ButtonProps) {
  return (
    <Pressable testID="button" onPress={onClick} disabled={!enabled}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Pressable>
  );
}

function OutlinedButton({ children, onClick, enabled = true }: ButtonProps) {
  return (
    <Pressable testID="button" onPress={onClick} disabled={!enabled}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Pressable>
  );
}

function TextButton({ children, onClick, enabled = true }: ButtonProps) {
  return (
    <Pressable testID="button" onPress={onClick} disabled={!enabled}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Pressable>
  );
}

function CircularProgressIndicator() {
  return <View testID="spinner" />;
}

type TextInputProps = {
  defaultValue?: string;
  onChangeText?: (value: string) => void;
  keyboardType?: string;
  autocorrection?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  ref?: unknown;
};

function TextInputComp({ defaultValue, onChangeText }: TextInputProps) {
  return (
    <TextInput
      testID="text-field"
      defaultValue={defaultValue}
      onChangeText={onChangeText}
    />
  );
}

type ComposeTextProps = {
  children?: ReactNode;
  style?: object;
  color?: string;
};

function ComposeText({ children }: ComposeTextProps) {
  return <Text>{children}</Text>;
}

export {
  Host,
  Button,
  OutlinedButton,
  TextButton,
  CircularProgressIndicator,
  TextInputComp as TextInput,
  ComposeText as Text,
};
