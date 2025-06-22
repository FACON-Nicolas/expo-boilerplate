import { useThemeColor } from '@/hooks/useThemeColor';
import {
  SafeAreaView,
  SafeAreaViewProps,
} from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
export default function ThemedSafeAreaView({
  children,
  style,
  ...props
}: SafeAreaViewProps) {
  const backgroundColor = useThemeColor({}, 'background');
  return (
    <SafeAreaView
      {...props}
      style={[styles.safeAreaView, { backgroundColor }, style]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
});
