import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

export const ThemedButton = ({
  children,
  style,
  ...props
}: Exclude<TouchableOpacityProps, 'activeOpacity'>) => {
  const backgroundColor = useThemeColor({}, 'primary');
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, style]}
      activeOpacity={0.8}
      {...props}
    >
      <ThemedText style={styles.buttonText}>{children}</ThemedText>
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
