import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

type AccessibilityState = {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isBoldTextEnabled: boolean;
  isGrayscaleEnabled: boolean;
  isInvertColorsEnabled: boolean;
  isReduceTransparencyEnabled: boolean;
};

export function useAccessibility(): AccessibilityState {
  const [state, setState] = useState<AccessibilityState>({
    isScreenReaderEnabled: false,
    isReduceMotionEnabled: false,
    isBoldTextEnabled: false,
    isGrayscaleEnabled: false,
    isInvertColorsEnabled: false,
    isReduceTransparencyEnabled: false,
  });

  useEffect(() => {
    const fetchInitialState = async () => {
      const [
        isScreenReaderEnabled,
        isReduceMotionEnabled,
        isBoldTextEnabled,
        isGrayscaleEnabled,
        isInvertColorsEnabled,
        isReduceTransparencyEnabled,
      ] = await Promise.all([
        AccessibilityInfo.isScreenReaderEnabled(),
        AccessibilityInfo.isReduceMotionEnabled(),
        AccessibilityInfo.isBoldTextEnabled(),
        AccessibilityInfo.isGrayscaleEnabled(),
        AccessibilityInfo.isInvertColorsEnabled(),
        AccessibilityInfo.isReduceTransparencyEnabled(),
      ]);

      setState({
        isScreenReaderEnabled,
        isReduceMotionEnabled,
        isBoldTextEnabled,
        isGrayscaleEnabled,
        isInvertColorsEnabled,
        isReduceTransparencyEnabled,
      });
    };

    fetchInitialState();

    const subscriptions = [
      AccessibilityInfo.addEventListener('screenReaderChanged', (isEnabled) => {
        setState((prev) => ({ ...prev, isScreenReaderEnabled: isEnabled }));
      }),
      AccessibilityInfo.addEventListener('reduceMotionChanged', (isEnabled) => {
        setState((prev) => ({ ...prev, isReduceMotionEnabled: isEnabled }));
      }),
      AccessibilityInfo.addEventListener('boldTextChanged', (isEnabled) => {
        setState((prev) => ({ ...prev, isBoldTextEnabled: isEnabled }));
      }),
      AccessibilityInfo.addEventListener('grayscaleChanged', (isEnabled) => {
        setState((prev) => ({ ...prev, isGrayscaleEnabled: isEnabled }));
      }),
      AccessibilityInfo.addEventListener('invertColorsChanged', (isEnabled) => {
        setState((prev) => ({ ...prev, isInvertColorsEnabled: isEnabled }));
      }),
      AccessibilityInfo.addEventListener('reduceTransparencyChanged', (isEnabled) => {
        setState((prev) => ({ ...prev, isReduceTransparencyEnabled: isEnabled }));
      }),
    ];

    return () => {
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, []);

  return state;
}

export function useScreenReader(): boolean {
  const { isScreenReaderEnabled } = useAccessibility();
  return isScreenReaderEnabled;
}

export function useReducedMotion(): boolean {
  const { isReduceMotionEnabled } = useAccessibility();
  return isReduceMotionEnabled;
}

export function useReducedTransparency(): boolean {
  const { isReduceTransparencyEnabled } = useAccessibility();
  return isReduceTransparencyEnabled;
}

export function announceForAccessibility(message: string): void {
  AccessibilityInfo.announceForAccessibility(message);
}
