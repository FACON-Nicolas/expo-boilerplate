#!/usr/bin/env node

const logger = require('./utils/logger');
const fileUtils = require('./utils/file-utils');
const packageUtils = require('./utils/package-utils');
const templateUtils = require('./utils/template-utils');
const promptUtils = require('./utils/prompt-utils');
const backupUtils = require('./utils/backup-utils');

const AXIOS_PACKAGE = 'axios';
const AXIOS_VERSION = '^1.7.0';

const PATHS_TO_BACKUP = [
  'infrastructure/api',
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
  const envTemplate = templateUtils.loadTemplate('backend/custom-api/env.ts.template');
  fileUtils.writeFile('core/config/env.ts', envTemplate);
};

const updateEnvExample = () => {
  const envExampleContent = `EXPO_PUBLIC_API_URL=http://localhost:3000/api
`;
  fileUtils.writeFile('.env.example', envExampleContent);
};

const createApiClient = () => {
  templateUtils.generateFromTemplate(
    'backend/custom-api/client.ts.template',
    'infrastructure/api/client.ts'
  );
};

const generateAuthRepository = () => {
  if (!fileUtils.directoryExists('features/auth')) {
    return false;
  }

  const repoPath = 'features/auth/data/repositories/api-auth-repository.ts';
  const placeholderPath = 'features/auth/data/repositories/placeholder-auth-repository.ts';

  if (fileUtils.fileExists(repoPath)) {
    logger.info('Auth repository already exists, skipping');
    return false;
  }

  if (fileUtils.fileExists(placeholderPath)) {
    templateUtils.generateFromTemplate(
      'backend/custom-api/auth-repository.ts.template',
      repoPath
    );
    fileUtils.deleteFile(placeholderPath);

    const supabasePath = 'features/auth/data/repositories/supabase-auth-repository.ts';
    if (fileUtils.fileExists(supabasePath)) {
      fileUtils.deleteFile(supabasePath);
    }
    return true;
  }

  logger.info('Auth repository already implemented, skipping');
  return false;
};

const generateProfileRepository = () => {
  if (!fileUtils.directoryExists('features/profile')) {
    return false;
  }

  const repoPath = 'features/profile/data/repositories/api-profile-repository.ts';
  const placeholderPath = 'features/profile/data/repositories/placeholder-profile-repository.ts';

  if (fileUtils.fileExists(repoPath)) {
    logger.info('Profile repository already exists, skipping');
    return false;
  }

  if (fileUtils.fileExists(placeholderPath)) {
    templateUtils.generateFromTemplate(
      'backend/custom-api/profile-repository.ts.template',
      repoPath
    );
    fileUtils.deleteFile(placeholderPath);

    const supabasePath = 'features/profile/data/repositories/supabase-profile-repository.ts';
    if (fileUtils.fileExists(supabasePath)) {
      fileUtils.deleteFile(supabasePath);
    }
    return true;
  }

  logger.info('Profile repository already implemented, skipping');
  return false;
};

const run = async () => {
  logger.header('Add Custom Backend (REST API)');

  const existingBackend = detectExistingBackend();

  if (existingBackend === 'custom-api') {
    logger.warning('Custom API backend is already configured');
    const shouldReinstall = await promptUtils.confirm('Do you want to reinstall it?');
    if (!shouldReinstall) {
      logger.info('Operation cancelled');
      process.exit(0);
    }
  }

  if (existingBackend === 'supabase') {
    logger.warning('Supabase backend is already configured');
    const shouldReplace = await promptUtils.confirm(
      'Do you want to replace it with custom API? (Supabase will be removed)'
    );
    if (!shouldReplace) {
      logger.info('Operation cancelled');
      process.exit(0);
    }

    logger.info('Removing Supabase backend first...');
    fileUtils.deleteDirectory('infrastructure/supabase');
    packageUtils.removeDependency('@supabase/supabase-js');
  }

  const existingFeatures = checkFeatures();
  if (existingFeatures.length > 0) {
    logger.info(`Found existing features: ${existingFeatures.join(', ')}`);
    logger.info('API repositories will be generated for these features');
  }

  if (!promptUtils.isForceMode()) {
    const confirmed = await promptUtils.confirm('Proceed with custom backend installation?');
    if (!confirmed) {
      logger.info('Operation cancelled');
      process.exit(0);
    }
  }

  const totalSteps = 5 + existingFeatures.length;
  let currentStep = 0;

  await backupUtils.withBackup(PATHS_TO_BACKUP, async () => {
    logger.step(++currentStep, totalSteps, 'Creating API client');
    createApiClient();

    logger.step(++currentStep, totalSteps, 'Updating environment configuration');
    updateEnvFile();

    logger.step(++currentStep, totalSteps, 'Updating .env.example');
    updateEnvExample();

    logger.step(++currentStep, totalSteps, 'Adding axios dependency');
    packageUtils.addDependency(AXIOS_PACKAGE, AXIOS_VERSION);

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
  logger.success('Custom API backend has been configured successfully!');
  logger.divider();
  logger.info('Next steps:');
  logger.list([
    'Run: npm install',
    'Configure EXPO_PUBLIC_API_URL in your .env file',
    'Customize infrastructure/api/client.ts for your API',
    'Update the repository implementations to match your API endpoints',
  ]);
};

run().catch((error) => {
  logger.error(`Failed: ${error.message}`);
  process.exit(1);
});
