import {
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { useToggle } from '@/core/presentation/hooks/use-toggle';
import { ThemedIcon } from '@/components/themed-icon';
import { useThemeColor } from '@/core/presentation/hooks/use-theme-color';

export function ThemedInput({
  style,
  secureTextEntry,
  ...props
}: TextInputProps) {
  const [isPasswordVisible, togglePasswordVisibility] = useToggle(false);

  const color = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'placeholder');
  const backgroundColor = useThemeColor({}, 'inputBackground');

  return (
    <ThemedView style={[styles.inputContainer, { backgroundColor }]}>
      <TextInput
        style={[styles.input, { color }, style]}
        {...props}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        placeholderTextColor={placeholderColor}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <ThemedIcon name={isPasswordVisible ? 'eye-off' : 'eye'} />
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    padding: 15,
    borderRadius: 12,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    height: 25,
  },
});
