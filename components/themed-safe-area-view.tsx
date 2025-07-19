import { useThemeColor } from '@/hooks/useThemeColor';
import {
  SafeAreaView,
  SafeAreaViewProps,
} from 'react-native-safe-area-context';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const RATIO = Math.round((WINDOW_HEIGHT / WINDOW_WIDTH) * 100) / 100;
const IPHONE_SE_RATIO = Math.round((568 / 320) * 100) / 100;

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
    paddingBottom:
      Platform.OS === 'ios' && RATIO !== IPHONE_SE_RATIO
        ? 0
        : WINDOW_HEIGHT * 0.02,
  },
});
