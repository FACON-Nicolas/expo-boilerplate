import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const BAR_WIDTH = 3;
const MAX_BAR_HEIGHT = 60;
const MIN_BAR_HEIGHT = 4;
const SPRING_CONFIG = { damping: 15, stiffness: 120 };

type WaveformBarProps = {
  normalizedHeight: number;
  color: string;
};

export function WaveformBar({ normalizedHeight, color }: WaveformBarProps) {
  const barHeight = useSharedValue(MIN_BAR_HEIGHT);

  useEffect(() => {
    const targetHeight = MIN_BAR_HEIGHT + normalizedHeight * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT);
    barHeight.value = withSpring(targetHeight, SPRING_CONFIG);
  }, [normalizedHeight, barHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: barHeight.value,
  }));

  return (
    <Animated.View
      style={[styles.bar, { backgroundColor: color, width: BAR_WIDTH }, animatedStyle]}
    />
  );
}

const styles = StyleSheet.create({
  bar: {
    alignSelf: 'center',
    borderRadius: 2,
  },
});
