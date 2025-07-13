import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';

type ThemedButtonProps = Exclude<TouchableOpacityProps, 'activeOpacity'> & {
  isLoading?: boolean;
  variant?: 'primary' | 'error';
};

export const ThemedButton = ({
  children,
  style,
  isLoading,
  variant = 'primary',
  ...props
}: ThemedButtonProps) => {
  const backgroundColor = useThemeColor({}, variant);
  const color = useThemeColor(
    {},
    variant === 'primary' ? 'background' : 'text'
  );
  return (
    <TouchableOpacity
      disabled={isLoading}
      style={[styles.button, { backgroundColor }, style]}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size='small' color={color} />
      ) : (
        <ThemedText style={[styles.buttonText, { color }]}>
          {children}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    width: '100%',
    textAlign: 'center',
  },
});
