import { TextField } from "heroui-native";
import { Pressable, type TextInputProps } from "react-native";

import { Icon } from "@/ui/components/icon";
import { View } from "@/ui/components/view";
import { useToggle } from "@/ui/hooks/use-toggle";

type InputProps = TextInputProps & {
  secureTextEntry?: boolean;
  label?: string;
  errorMessage?: string;
};

export function Input({
  secureTextEntry,
  label,
  errorMessage,
  ...props
}: InputProps) {
  const [isPasswordVisible, togglePasswordVisibility] = useToggle(false);
  const isSecure = secureTextEntry && !isPasswordVisible;

  return (
    <TextField isInvalid={!!errorMessage} className='w-full'>
      {label && <TextField.Label>{label}</TextField.Label>}
      <View className='relative'>
        <TextField.Input
          {...props}
          keyboardType='default'
          key={isSecure ? "secure" : "visible"}
          className='rounded-md bg-input-background p-4'
          autoCapitalize={"none"}
          secureTextEntry={isSecure}
        />
        {secureTextEntry && (
          <Pressable
            onPress={togglePasswordVisibility}
            className='absolute right-4 top-1/2 -translate-y-1/2'
          >
            <Icon name={isPasswordVisible ? "eye-off" : "eye"} />
          </Pressable>
        )}
      </View>
      {errorMessage && (
        <TextField.ErrorMessage>{errorMessage}</TextField.ErrorMessage>
      )}
    </TextField>
  );
}
