module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  moduleNameMapper: {
    '^@/ui/components/icon$': '<rootDir>/__mocks__/ui/components/icon.tsx',
    '^@/ui/components/view$': '<rootDir>/__mocks__/ui/components/view.tsx',
    '^@/(.*)$': '<rootDir>/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|heroui-native|tailwind-variants|uniwind|msw|until-async|@bundled-es-modules)',
  ],
  collectCoverageFrom: [
    'features/**/domain/usecases/**/*.ts',
    'features/**/presentation/hooks/**/*.ts',
    'features/**/presentation/store/**/*.ts',
    'ui/components/**/*.tsx',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    'features/**/domain/usecases/**/*.ts': {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  testEnvironment: 'node',
  clearMocks: true,
  resetMocks: true,
};
