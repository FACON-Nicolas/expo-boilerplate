import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

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
  const textColor = useThemeColor({}, 'text');
  return (
    <TouchableOpacity
      disabled={isLoading}
      style={[styles.button, { backgroundColor }, style]}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size='small' color={textColor} />
      ) : (
        <ThemedText style={styles.buttonText}>{children}</ThemedText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 16,
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
