module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
  moduleNameMapper: {
    "^@expo/ui/swift-ui$": "<rootDir>/__mocks__/@expo/ui/swift-ui.tsx",
    "^@expo/ui/swift-ui/modifiers$": "<rootDir>/__mocks__/@expo/ui/swift-ui-modifiers.ts",
    "^@expo/ui/jetpack-compose$": "<rootDir>/__mocks__/@expo/ui/jetpack-compose.tsx",
    "^@expo/ui/jetpack-compose/modifiers$": "<rootDir>/__mocks__/@expo/ui/jetpack-compose-modifiers.ts",
    "^@/ui/components/icon$": "<rootDir>/__mocks__/ui/components/icon.tsx",
    "^@/ui/components/view$": "<rootDir>/__mocks__/ui/components/view.tsx",
    "^@/ui/theme/use-theme-colors$": "<rootDir>/__mocks__/ui/theme/use-theme-colors.ts",
    "^@/(.*)$": "<rootDir>/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|msw|until-async|@bundled-es-modules)",
  ],
  collectCoverageFrom: [
    "features/**/domain/usecases/**/*.ts",
    "features/**/presentation/hooks/**/*.ts",
    "features/**/presentation/store/**/*.ts",
    "ui/components/**/*.tsx",
    "!**/*.d.ts",
  ],
  coverageThreshold: {
    "features/**/domain/usecases/**/*.ts": {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  testEnvironment: "node",
  clearMocks: true,
  resetMocks: true,
};
