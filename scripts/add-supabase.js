#!/usr/bin/env node

const logger = require('./utils/logger');
const fileUtils = require('./utils/file-utils');
const packageUtils = require('./utils/package-utils');
const templateUtils = require('./utils/template-utils');
const promptUtils = require('./utils/prompt-utils');
const backupUtils = require('./utils/backup-utils');

const SUPABASE_PACKAGE = '@supabase/supabase-js';
const SUPABASE_VERSION = '^2.47.16';

const PATHS_TO_BACKUP = [
  'infrastructure/supabase',
  'core/config/env.ts',
  '.env.example',
  'package.json',
];

const detectExistingBackend = () => {
  if (fileUtils.directoryExists('infrastructure/supabase')) {
    return 'supabase';
  }
  if (fileUtils.directoryExists('infrastructure/api')) {
    return 'custom-api';
  }
  return null;
};

const checkFeatures = () => {
  const features = [];
  if (fileUtils.directoryExists('features/auth')) {
    features.push('auth');
  }
  if (fileUtils.directoryExists('features/profile')) {
    features.push('profile');
  }
  return features;
};

const updateEnvFile = () => {
  const envTemplate = templateUtils.loadTemplate('backend/supabase/env.ts.template');
  fileUtils.writeFile('core/config/env.ts', envTemplate);
};

const updateEnvExample = () => {
  const envExampleContent = `EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
EXPO_PUBLIC_SUPABASE_EMAIL_LOGIN_DEV=
EXPO_PUBLIC_SUPABASE_PASSWORD_LOGIN_DEV=
`;
  fileUtils.writeFile('.env.example', envExampleContent);
};

const createSupabaseClient = () => {
  templateUtils.generateFromTemplate(
    'backend/supabase/client.ts.template',
    'infrastructure/supabase/client.ts'
  );
};

const generateAuthRepository = () => {
  if (!fileUtils.directoryExists('features/auth')) {
    return false;
  }

  const repoPath = 'features/auth/data/repositories/supabase-auth-repository.ts';
  const placeholderPath = 'features/auth/data/repositories/placeholder-auth-repository.ts';

  if (fileUtils.fileExists(repoPath)) {
    logger.info('Auth repository already exists, skipping');
    return false;
  }

  if (fileUtils.fileExists(placeholderPath)) {
    templateUtils.generateFromTemplate(
      'backend/supabase/auth-repository.ts.template',
      repoPath
    );
    fileUtils.deleteFile(placeholderPath);
    return true;
  }

  logger.info('Auth repository already implemented, skipping');
  return false;
};

const generateProfileRepository = () => {
  if (!fileUtils.directoryExists('features/profile')) {
    return false;
  }

  const repoPath = 'features/profile/data/repositories/supabase-profile-repository.ts';
  const placeholderPath = 'features/profile/data/repositories/placeholder-profile-repository.ts';

  if (fileUtils.fileExists(repoPath)) {
    logger.info('Profile repository already exists, skipping');
    return false;
  }

  if (fileUtils.fileExists(placeholderPath)) {
    templateUtils.generateFromTemplate(
      'backend/supabase/profile-repository.ts.template',
      repoPath
    );
    fileUtils.deleteFile(placeholderPath);
    return true;
  }

  logger.info('Profile repository already implemented, skipping');
  return false;
};

const run = async () => {
  logger.header('Add Supabase Backend');

  const existingBackend = detectExistingBackend();

  if (existingBackend === 'supabase') {
    logger.warning('Supabase is already configured');
    const shouldReinstall = await promptUtils.confirm('Do you want to reinstall it?');
    if (!shouldReinstall) {
      logger.info('Operation cancelled');
      process.exit(0);
    }
  }

  if (existingBackend === 'custom-api') {
    logger.warning('Custom API backend is already configured');
    const shouldReplace = await promptUtils.confirm(
      'Do you want to replace it with Supabase? (Custom API will be removed)'
    );
    if (!shouldReplace) {
      logger.info('Operation cancelled');
      process.exit(0);
    }

    logger.info('Removing custom API backend first...');
    fileUtils.deleteDirectory('infrastructure/api');
    packageUtils.removeDependency('axios');
  }

  const existingFeatures = checkFeatures();
  if (existingFeatures.length > 0) {
    logger.info(`Found existing features: ${existingFeatures.join(', ')}`);
    logger.info('Supabase repositories will be generated for these features');
  }

  if (!promptUtils.isForceMode()) {
    const confirmed = await promptUtils.confirm('Proceed with Supabase installation?');
    if (!confirmed) {
      logger.info('Operation cancelled');
      process.exit(0);
    }
  }

  const totalSteps = 5 + existingFeatures.length;
  let currentStep = 0;

  await backupUtils.withBackup(PATHS_TO_BACKUP, async () => {
    logger.step(++currentStep, totalSteps, 'Creating Supabase client');
    createSupabaseClient();

    logger.step(++currentStep, totalSteps, 'Updating environment configuration');
    updateEnvFile();

    logger.step(++currentStep, totalSteps, 'Updating .env.example');
    updateEnvExample();

    logger.step(++currentStep, totalSteps, 'Adding Supabase dependency');
    packageUtils.addDependency(SUPABASE_PACKAGE, SUPABASE_VERSION);

    if (existingFeatures.includes('auth')) {
      logger.step(++currentStep, totalSteps, 'Generating auth repository');
      generateAuthRepository();
    }

    if (existingFeatures.includes('profile')) {
      logger.step(++currentStep, totalSteps, 'Generating profile repository');
      generateProfileRepository();
    }

    logger.step(totalSteps, totalSteps, 'Done');
  });

  logger.divider();
  logger.success('Supabase has been configured successfully!');
  logger.divider();
  logger.info('Next steps:');
  logger.list([
    'Run: npm install',
    'Configure your .env file with Supabase credentials',
    'Update infrastructure/supabase/client.ts if needed',
  ]);
};

run().catch((error) => {
  logger.error(`Failed: ${error.message}`);
  process.exit(1);
});
