#!/usr/bin/env node

const logger = require('./utils/logger');
const fileUtils = require('./utils/file-utils');
const packageUtils = require('./utils/package-utils');
const templateUtils = require('./utils/template-utils');
const promptUtils = require('./utils/prompt-utils');
const backupUtils = require('./utils/backup-utils');

const AXIOS_PACKAGE = 'axios';

const PATHS_TO_BACKUP = [
  'infrastructure/api',
  'features/auth/data/repositories',
  'features/profile/data/repositories',
  'core/config/env.ts',
  '.env.example',
  'package.json',
];

const checkCustomApiInstalled = () => {
  return fileUtils.directoryExists('infrastructure/api');
};

const checkFeatures = () => {
  const features = [];
  if (fileUtils.fileExists('features/auth/data/repositories/api-auth-repository.ts')) {
    features.push('auth');
  }
  if (fileUtils.fileExists('features/profile/data/repositories/api-profile-repository.ts')) {
    features.push('profile');
  }
  return features;
};

const removeApiClient = () => {
  fileUtils.deleteDirectory('infrastructure/api');
};

const createPlaceholderEnv = () => {
  const placeholderEnv = templateUtils.loadTemplate('placeholder/env.ts.template');
  fileUtils.writeFile('core/config/env.ts', placeholderEnv);
};

const cleanEnvExample = () => {
  fileUtils.writeFile('.env.example', '# Add your environment variables here\n');
};

const createPlaceholderAuthRepository = () => {
  const apiRepoPath = 'features/auth/data/repositories/api-auth-repository.ts';
  if (fileUtils.fileExists(apiRepoPath)) {
    fileUtils.deleteFile(apiRepoPath);
  }

  const content = `import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository';

export const createPlaceholderAuthRepository = (): AuthRepository => ({
  signIn: async () => {
    throw new Error('Not implemented - configure a backend first');
  },
  signUp: async () => {
    throw new Error('Not implemented - configure a backend first');
  },
  signOut: async () => {
    throw new Error('Not implemented - configure a backend first');
  },
  refreshSession: async () => {
    throw new Error('Not implemented - configure a backend first');
  },
  setSession: async () => {
    throw new Error('Not implemented - configure a backend first');
  },
});
`;
  fileUtils.writeFile('features/auth/data/repositories/placeholder-auth-repository.ts', content);
};

const createPlaceholderProfileRepository = () => {
  const apiRepoPath = 'features/profile/data/repositories/api-profile-repository.ts';
  if (fileUtils.fileExists(apiRepoPath)) {
    fileUtils.deleteFile(apiRepoPath);
  }

  const content = `import type { ProfileRepository } from '@/features/profile/domain/repositories/profile-repository';

export const createPlaceholderProfileRepository = (): ProfileRepository => ({
  fetchProfile: async () => {
    throw new Error('Not implemented - configure a backend first');
  },
  createProfile: async () => {
    throw new Error('Not implemented - configure a backend first');
  },
  updateProfile: async () => {
    throw new Error('Not implemented - configure a backend first');
  },
});
`;
  fileUtils.writeFile('features/profile/data/repositories/placeholder-profile-repository.ts', content);
};

const run = async () => {
  logger.header('Remove Custom Backend');

  if (!checkCustomApiInstalled()) {
    logger.warning('Custom API backend is not installed');
    process.exit(0);
  }

  const affectedFeatures = checkFeatures();

  if (affectedFeatures.length > 0) {
    logger.warning(`The following features use custom API: ${affectedFeatures.join(', ')}`);
    logger.info('Placeholder repositories will be created for these features');
  }

  if (!promptUtils.isForceMode()) {
    const confirmed = await promptUtils.confirm(
      'Are you sure you want to remove the custom backend?'
    );
    if (!confirmed) {
      logger.info('Operation cancelled');
      process.exit(0);
    }
  }

  const totalSteps = 5;
  let currentStep = 0;

  await backupUtils.withBackup(PATHS_TO_BACKUP, async () => {
    logger.step(++currentStep, totalSteps, 'Removing API client');
    removeApiClient();

    logger.step(++currentStep, totalSteps, 'Creating placeholder env configuration');
    createPlaceholderEnv();

    logger.step(++currentStep, totalSteps, 'Cleaning .env.example');
    cleanEnvExample();

    logger.step(++currentStep, totalSteps, 'Removing axios dependency');
    packageUtils.removeDependency(AXIOS_PACKAGE);

    logger.step(++currentStep, totalSteps, 'Creating placeholder repositories');
    if (affectedFeatures.includes('auth')) {
      createPlaceholderAuthRepository();
    }
    if (affectedFeatures.includes('profile')) {
      createPlaceholderProfileRepository();
    }
  });

  logger.divider();
  logger.success('Custom backend has been removed successfully!');
  logger.divider();
  logger.info('Next steps:');
  logger.list([
    'Run: npm install',
    'Configure a new backend:',
    '  - npm run add:supabase',
    '  - npm run add:custom-backend (to reinstall)',
  ]);
};

run().catch((error) => {
  logger.error(`Failed: ${error.message}`);
  process.exit(1);
});
