#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const fileUtils = require('./utils/file-utils');
const promptUtils = require('./utils/prompt-utils');
const backupUtils = require('./utils/backup-utils');

const CONFIG_PATH = path.resolve(__dirname, './config/features.json');

const PATHS_TO_BACKUP = [
  'features/auth',
  '__tests__/features/auth',
  'app/(public)',
  'app/_layout.tsx',
];

const loadFeaturesConfig = () => {
  if (fs.existsSync(CONFIG_PATH)) {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  }
  return {};
};

const checkDependents = () => {
  const config = loadFeaturesConfig();
  const dependents = [];

  for (const [name, feature] of Object.entries(config)) {
    if (feature.dependencies && feature.dependencies.includes('auth')) {
      if (fileUtils.directoryExists(`features/${name}`)) {
        dependents.push(name);
      }
    }
  }

  return dependents;
};

const removeAuthFromLayout = () => {
  const layoutPath = 'app/_layout.tsx';

  if (!fileUtils.fileExists(layoutPath)) {
    return;
  }

  const content = fileUtils.readFile(layoutPath);

  const hasAuthImport = content.includes('useAuthentication');

  if (!hasAuthImport) {
    logger.info('Layout does not use authentication');
    return;
  }

  const newLayout = `import "@/global.css";

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

  fileUtils.writeFile(layoutPath, newLayout);
};

const run = async () => {
  logger.header('Remove Authentication Feature');

  if (!fileUtils.directoryExists('features/auth')) {
    logger.warning('Auth feature is not installed');
    process.exit(0);
  }

  const dependents = checkDependents();

  if (dependents.length > 0) {
    logger.warning(`The following features depend on auth: ${dependents.join(', ')}`);
    const removeDependents = await promptUtils.confirm('Do you want to remove them as well?');

    if (removeDependents) {
      for (const dependent of dependents) {
        logger.info(`Will also remove: ${dependent}`);
      }
    } else {
      logger.warning('Proceeding anyway. Dependent features may break.');
    }
  }

  if (!promptUtils.isForceMode()) {
    const confirmed = await promptUtils.confirm(
      'Are you sure you want to remove the auth feature? This will also remove public routes.'
    );
    if (!confirmed) {
      logger.info('Operation cancelled');
      process.exit(0);
    }
  }

  const totalSteps = 4 + dependents.length;
  let currentStep = 0;

  await backupUtils.withBackup(PATHS_TO_BACKUP, async () => {
    if (dependents.length > 0) {
      for (const dependent of dependents) {
        logger.step(++currentStep, totalSteps, `Removing dependent feature: ${dependent}`);
        fileUtils.deleteDirectory(`features/${dependent}`);
        fileUtils.deleteDirectory(`__tests__/features/${dependent}`);
      }
    }

    logger.step(++currentStep, totalSteps, 'Removing auth feature');
    fileUtils.deleteDirectory('features/auth');

    logger.step(++currentStep, totalSteps, 'Removing auth tests');
    fileUtils.deleteDirectory('__tests__/features/auth');

    logger.step(++currentStep, totalSteps, 'Removing public routes');
    fileUtils.deleteDirectory('app/(public)');

    logger.step(++currentStep, totalSteps, 'Updating layout');
    removeAuthFromLayout();
  });

  logger.divider();
  logger.success('Auth feature has been removed successfully!');
  logger.divider();
  logger.info('Next steps:');
  logger.list([
    'Review app/_layout.tsx for any remaining auth references',
    'Remove any auth-related imports from other files',
    'Run npm run lint to check for broken imports',
  ]);
};

run().catch((error) => {
  logger.error(`Failed: ${error.message}`);
  process.exit(1);
});
