const Reanimated = {
  default: {
    call: () => {},
  },
  useSharedValue: jest.fn(),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn(),
  withSpring: jest.fn(),
  withSequence: jest.fn(),
  withDelay: jest.fn(),
  withRepeat: jest.fn(),
  Easing: {
    linear: jest.fn(),
    ease: jest.fn(),
    bezier: jest.fn(),
  },
};

export default Reanimated;
