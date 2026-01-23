import { Children, cloneElement, isValidElement } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import type { ReactElement, ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  isDisabled?: boolean;
};

function Button({ children, onPress, isDisabled }: ButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={isDisabled} testID="heroui-button">
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Pressable>
  );
}

Button.Label = function ButtonLabel({ children }: { children: ReactNode }) {
  return <Text>{children}</Text>;
};

function Spinner() {
  return <View testID="spinner" />;
}

type TextFieldProps = {
  children: ReactNode;
  isInvalid?: boolean;
};

function TextField({ children, isInvalid }: TextFieldProps) {
  return (
    <View testID="text-field" data-invalid={isInvalid}>
      {children}
    </View>
  );
}

TextField.Label = function TextFieldLabel({ children }: { children: ReactNode }) {
  return <Text>{children}</Text>;
};

TextField.Input = function TextFieldInput(props: Record<string, unknown>) {
  return <TextInput {...props} />;
};

TextField.ErrorMessage = function TextFieldErrorMessage({ children }: { children: ReactNode }) {
  return <Text testID="error-message">{children}</Text>;
};

type RadioGroupProps = {
  children: ReactNode;
  value: string;
  onValueChange: (v: string) => void;
};

function RadioGroup({ children, value, onValueChange }: RadioGroupProps) {
  return (
    <View testID="radio-group">
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child as ReactElement<{ selectedValue?: string; onSelect?: (v: string) => void }>, {
            selectedValue: value,
            onSelect: onValueChange,
          });
        }
        return child;
      })}
    </View>
  );
}

type RadioGroupItemProps = {
  children: ReactNode;
  value: string;
  selectedValue?: string;
  onSelect?: (v: string) => void;
};

RadioGroup.Item = function RadioGroupItem({ children, value, selectedValue, onSelect }: RadioGroupItemProps) {
  return (
    <Pressable
      testID={`radio-item-${value}`}
      onPress={() => onSelect?.(value)}
      accessibilityState={{ checked: selectedValue === value }}
    >
      {children}
    </Pressable>
  );
};

RadioGroup.Indicator = function RadioGroupIndicator() {
  return null;
};

RadioGroup.Label = function RadioGroupLabel({ children }: { children: ReactNode }) {
  return <Text>{children}</Text>;
};

export function useThemeColor(colors: string[]) {
  return colors.map(() => '#000000');
}

export { Button, Spinner, TextField, RadioGroup };
