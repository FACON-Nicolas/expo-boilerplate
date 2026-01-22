import { TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/core/presentation/hooks/use-theme-color';

export type ThemedOptionProps = TouchableOpacityProps & {
  children: React.ReactNode;
  isSelected?: boolean;
};

export function ThemedOption({
  children,
  style,
  isSelected = false,
  ...otherProps
}: ThemedOptionProps) {
  const backgroundColor = useThemeColor({}, isSelected ? 'tint' : 'background');
  const borderColor = useThemeColor({}, isSelected ? 'tint' : 'border');
  const textColor = useThemeColor({}, isSelected ? 'background' : 'text');

  return (
    <TouchableOpacity
      style={[
        styles.option,
        { backgroundColor, borderColor },
        style,
      ]}
      activeOpacity={0.8}
      {...otherProps}
    >
      <ThemedText style={[styles.optionText, { color: textColor }]}>
        {children}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});