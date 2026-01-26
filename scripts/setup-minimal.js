#!/usr/bin/env node

const logger = require('./utils/logger');
const fileUtils = require('./utils/file-utils');
const packageUtils = require('./utils/package-utils');
const templateUtils = require('./utils/template-utils');
const promptUtils = require('./utils/prompt-utils');
const backupUtils = require('./utils/backup-utils');

const PATHS_TO_BACKUP = [
  'infrastructure',
  'features',
  '__tests__/features',
  'app/(public)',
  'app/(protected)',
  'app/_layout.tsx',
  'core/config/env.ts',
  '.env.example',
  'package.json',
];

const removeBackend = () => {
  if (fileUtils.directoryExists('infrastructure/supabase')) {
    logger.info('Removing Supabase...');
    fileUtils.deleteDirectory('infrastructure/supabase');
    packageUtils.removeDependency('@supabase/supabase-js');
  }

  if (fileUtils.directoryExists('infrastructure/api')) {
    logger.info('Removing custom API...');
    fileUtils.deleteDirectory('infrastructure/api');
    packageUtils.removeDependency('axios');
  }

  if (fileUtils.directoryExists('infrastructure') && fileUtils.listDirectory('infrastructure').length === 0) {
    fileUtils.deleteDirectory('infrastructure');
  }
};

const removeFeatures = () => {
  if (fileUtils.directoryExists('features/auth')) {
    logger.info('Removing auth feature...');
    fileUtils.deleteDirectory('features/auth');
    fileUtils.deleteDirectory('__tests__/features/auth');
  }

  if (fileUtils.directoryExists('features/profile')) {
    logger.info('Removing profile feature...');
    fileUtils.deleteDirectory('features/profile');
    fileUtils.deleteDirectory('__tests__/features/profile');
  }

  const remainingFeatures = fileUtils.listDirectory('features');
  for (const feature of remainingFeatures) {
    logger.info(`Removing feature: ${feature}...`);
    fileUtils.deleteDirectory(`features/${feature}`);
    if (fileUtils.directoryExists(`__tests__/features/${feature}`)) {
      fileUtils.deleteDirectory(`__tests__/features/${feature}`);
    }
  }
};

const removePublicRoutes = () => {
  if (fileUtils.directoryExists('app/(public)')) {
    fileUtils.deleteDirectory('app/(public)');
  }
};

const createMinimalEnv = () => {
  const minimalEnv = `import { z } from 'zod';

const envSchema = z.object({});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse({});

  if (!result.success) {
    const missingVars = result.error.issues
      .map((issue) => issue.path.join('.'))
      .join(', ');
    throw new Error(\`Missing or invalid environment variables: \${missingVars}\`);
  }

  return result.data;
}

export const env = validateEnv();
`;
  fileUtils.writeFile('core/config/env.ts', minimalEnv);
  fileUtils.writeFile('.env.example', '# Add your environment variables here\n');
};

const createMinimalLayout = () => {
  const minimalLayout = `import "@/global.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { queryClient } from "@/core/config/query-client";
import { ErrorBoundary } from "@/core/presentation/components/error-boundary";
import { ErrorFallback } from "@/core/presentation/components/error-fallback";
import { SplashGate } from "@/core/presentation/components/splash-gate";

import "@/i18n";

function NavigationStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(protected)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar translucent />
        <ErrorBoundary fallback={(props) => <ErrorFallback {...props} />}>
          <SplashGate>
            <HeroUINativeProvider>
              <NavigationStack />
            </HeroUINativeProvider>
          </SplashGate>
        </ErrorBoundary>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
`;
  fileUtils.writeFile('app/_layout.tsx', minimalLayout);
};

const createMinimalHomePage = () => {
  const homePage = `import { View } from '@/ui/components/view';
import { Text } from '@/ui/components/text';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-2xl font-bold mb-4">Welcome</Text>
      <Text className="text-base text-gray-600 text-center">
        Your minimal Expo boilerplate is ready.
      </Text>
    </View>
  );
}
`;

  if (fileUtils.fileExists('app/(protected)/(tabs)/index.tsx')) {
    fileUtils.writeFile('app/(protected)/(tabs)/index.tsx', homePage);
  }
};

const removeProfileTab = () => {
  const profileTabPath = 'app/(protected)/(tabs)/profile.tsx';
  if (fileUtils.fileExists(profileTabPath)) {
    fileUtils.deleteFile(profileTabPath);
  }

  const tabLayoutPath = 'app/(protected)/(tabs)/_layout.tsx';
  if (fileUtils.fileExists(tabLayoutPath)) {
    const content = fileUtils.readFile(tabLayoutPath);
    if (content.includes('profile')) {
      const updatedContent = content
        .replace(/\s*<Tabs\.Screen[^>]*name="profile"[^/]*\/>/g, '')
        .replace(/\s*<Tabs\.Screen\s+name="profile"[\s\S]*?\/>/g, '');

      if (content !== updatedContent) {
        fileUtils.writeFile(tabLayoutPath, updatedContent);
      }
    }
  }
};

const run = async () => {
  logger.header('Setup Minimal Project');

  logger.warning('This will remove:');
  logger.list([
    'All backend configurations (Supabase, custom API)',
    'All features (auth, profile, and any custom features)',
    'All related tests',
    'Public routes',
  ]);

  logger.info('');
  logger.info('You will keep:');
  logger.list([
    'UI components and theming',
    'Navigation (Expo Router)',
    'Core utilities',
    'i18n setup',
    'React Query setup',
  ]);

  if (!promptUtils.isForceMode()) {
    const confirmed = await promptUtils.confirm(
      'Are you sure you want to proceed? This is a destructive operation.'
    );
    if (!confirmed) {
      logger.info('Operation cancelled');
      process.exit(0);
    }

    const doubleConfirmed = await promptUtils.confirm(
      'This cannot be undone easily. Are you REALLY sure?'
    );
    if (!doubleConfirmed) {
      logger.info('Operation cancelled');
      process.exit(0);
    }
  }

  const totalSteps = 7;
  let currentStep = 0;

  await backupUtils.withBackup(PATHS_TO_BACKUP, async () => {
    logger.step(++currentStep, totalSteps, 'Removing backend');
    removeBackend();

    logger.step(++currentStep, totalSteps, 'Removing features');
    removeFeatures();

    logger.step(++currentStep, totalSteps, 'Removing public routes');
    removePublicRoutes();

    logger.step(++currentStep, totalSteps, 'Creating minimal env configuration');
    createMinimalEnv();

    logger.step(++currentStep, totalSteps, 'Updating layout');
    createMinimalLayout();

    logger.step(++currentStep, totalSteps, 'Updating home page');
    createMinimalHomePage();

    logger.step(++currentStep, totalSteps, 'Cleaning up tabs');
    removeProfileTab();
  });

  logger.divider();
  logger.success('Minimal setup complete!');
  logger.divider();
  logger.info('Your project now has:');
  logger.list([
    'HeroUI Native + Tailwind styling',
    'Expo Router navigation',
    'React Query for data fetching',
    'i18n internationalization',
    'Error boundary',
  ]);
  logger.divider();
  logger.info('To add features back:');
  logger.list([
    'npm run add:supabase     - Add Supabase backend',
    'npm run add:custom-backend - Add REST API backend',
    'npm run add:auth         - Add authentication',
    'npm run add:profile      - Add user profile',
    'npm run add:feature <name> - Add custom feature',
  ]);
};

run().catch((error) => {
  logger.error(`Failed: ${error.message}`);
  process.exit(1);
});
