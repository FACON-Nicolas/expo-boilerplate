import { Pressable, Text as RNText, TextInput, View } from 'react-native';

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
  label?: string;
  onPress?: () => void;
  modifiers?: unknown[];
  role?: string;
  children?: ReactNode;
};

function Button({ label, onPress, modifiers, children }: ButtonProps) {
  const isDisabled = Array.isArray(modifiers) && modifiers.some(
    (m) => m && typeof m === 'object' && (m as Record<string, unknown>).type === 'disabled'
  );
  const content = label || children;
  return (
    <Pressable testID="button" onPress={onPress} disabled={isDisabled}>
      {content ? <RNText>{content}</RNText> : null}
    </Pressable>
  );
}

function ProgressView() {
  return <View testID="spinner" />;
}

type TextFieldProps = {
  defaultValue?: string;
  placeholder?: string;
  onChangeText?: (value: string) => void;
  onChangeFocus?: (focused: boolean) => void;
  keyboardType?: string;
  autocorrection?: boolean;
  ref?: unknown;
};

function TextField({ defaultValue, placeholder, onChangeText }: TextFieldProps) {
  return (
    <TextInput
      testID="text-field"
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChangeText={onChangeText}
    />
  );
}

function SecureField({ defaultValue, placeholder, onChangeText }: TextFieldProps) {
  return (
    <TextInput
      testID="secure-field"
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChangeText={onChangeText}
      secureTextEntry
    />
  );
}

type TextProps = {
  children?: ReactNode;
  modifiers?: unknown[];
};

function Text({ children }: TextProps) {
  return <RNText>{children}</RNText>;
}

export type TextFieldRef = { setText: (value: string) => void };
export type SecureFieldRef = { setText: (value: string) => void };
export type TextFieldKeyboardType = string;

export { Host, Button, ProgressView, TextField, SecureField, Text };
