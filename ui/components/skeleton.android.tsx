import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { useThemeColors } from '@/ui/theme/use-theme-colors';

type SkeletonVariant = 'text' | 'title' | 'avatar' | 'button' | 'input' | 'card';

type SkeletonProps = {
  variant?: SkeletonVariant;
};

const VARIANT_DIMENSIONS: Record<SkeletonVariant, object> = {
  text:   { height: 16, width: '100%', borderRadius: 4 },
  title:  { height: 24, width: '75%',  borderRadius: 4 },
  avatar: { height: 48, width: 48,     borderRadius: 24 },
  button: { height: 56, width: '100%', borderRadius: 8 },
  input:  { height: 56, width: '100%', borderRadius: 8 },
  card:   { height: 128, width: '100%', borderRadius: 12 },
};

export function Skeleton({ variant = 'text' }: SkeletonProps) {
  const colors = useThemeColors();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[VARIANT_DIMENSIONS[variant], { backgroundColor: colors.border }, animatedStyle]}
    />
  );
}

export function SkeletonGroup({ children }: { children: React.ReactNode }) {
  return <View style={styles.group}>{children}</View>;
}

const styles = StyleSheet.create({
  group: {
    gap: 12,
  },
});
