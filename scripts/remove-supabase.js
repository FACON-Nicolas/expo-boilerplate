#!/usr/bin/env node

const logger = require('./utils/logger');
const fileUtils = require('./utils/file-utils');
const packageUtils = require('./utils/package-utils');
const templateUtils = require('./utils/template-utils');
const promptUtils = require('./utils/prompt-utils');
const backupUtils = require('./utils/backup-utils');

const SUPABASE_PACKAGE = '@supabase/supabase-js';

const PATHS_TO_BACKUP = [
  'infrastructure/supabase',
  'features/auth/data/repositories',
  'features/profile/data/repositories',
  'core/config/env.ts',
  '.env.example',
  'package.json',
];

const checkSupabaseInstalled = () => {
  return fileUtils.directoryExists('infrastructure/supabase');
};

const checkFeatures = () => {
  const features = [];
  if (fileUtils.fileExists('features/auth/data/repositories/supabase-auth-repository.ts')) {
    features.push('auth');
  }
  if (fileUtils.fileExists('features/profile/data/repositories/supabase-profile-repository.ts')) {
    features.push('profile');
  }
  return features;
};

const removeSupabaseClient = () => {
  fileUtils.deleteDirectory('infrastructure/supabase');
};

const SUPABASE_ENV_VARS = [
  'EXPO_PUBLIC_SUPABASE_URL',
  'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'EXPO_PUBLIC_SUPABASE_EMAIL_LOGIN_DEV',
  'EXPO_PUBLIC_SUPABASE_PASSWORD_LOGIN_DEV',
];

const removeSupabaseEnvVars = () => {
  const envPath = 'core/config/env.ts';
  const content = fileUtils.readFile(envPath);
  const lines = content.split('\n');
  const result = [];
  let skipNextContinuation = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (skipNextContinuation) {
      if (trimmed.startsWith('process.env.')) {
        skipNextContinuation = false;
        continue;
      }
    }

    const isSupabaseVar = SUPABASE_ENV_VARS.some((v) => trimmed.startsWith(`${v}:`));

    if (isSupabaseVar) {
      if (!trimmed.includes('process.env.') && !trimmed.endsWith(',')) {
        skipNextContinuation = true;
      }
      continue;
    }

    result.push(line);
  }

  let updatedContent = result.join('\n');
  updatedContent = updatedContent.replace(/\n{3,}/g, '\n\n');

  fileUtils.writeFile(envPath, updatedContent);
};

const cleanEnvExample = () => {
  const envExamplePath = '.env.example';
  if (!fileUtils.fileExists(envExamplePath)) {
    return;
  }

  const content = fileUtils.readFile(envExamplePath);
  const lines = content.split('\n');
  const filteredLines = lines.filter((line) => {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) {
      return true;
    }
    const varName = trimmed.split('=')[0];
    return !SUPABASE_ENV_VARS.includes(varName);
  });

  let result = filteredLines.join('\n');
  if (!result.endsWith('\n')) {
    result += '\n';
  }
  fileUtils.writeFile(envExamplePath, result);
};

const createPlaceholderAuthRepository = () => {
  const authRepoPath = 'features/auth/data/repositories/supabase-auth-repository.ts';
  if (fileUtils.fileExists(authRepoPath)) {
    fileUtils.deleteFile(authRepoPath);
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
  getSession: async () => {
    throw new Error('Not implemented - configure a backend first');
  },
  subscribeToAuthChanges: () => {
    throw new Error('Not implemented - configure a backend first');
  },
});
`;
  fileUtils.writeFile('features/auth/data/repositories/placeholder-auth-repository.ts', content);
};

const createPlaceholderProfileRepository = () => {
  const profileRepoPath = 'features/profile/data/repositories/supabase-profile-repository.ts';
  if (fileUtils.fileExists(profileRepoPath)) {
    fileUtils.deleteFile(profileRepoPath);
  }

  const content = `import type { ProfileRepository } from '@/features/profile/domain/repositories/profile-repository';

export const createPlaceholderProfileRepository = (): ProfileRepository => ({
  getProfile: async () => {
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
  logger.header('Remove Supabase Backend');

  if (!checkSupabaseInstalled()) {
    logger.warning('Supabase is not installed');
    process.exit(0);
  }

  const affectedFeatures = checkFeatures();

  if (affectedFeatures.length > 0) {
    logger.warning(`The following features use Supabase: ${affectedFeatures.join(', ')}`);
    logger.info('Placeholder repositories will be created for these features');
  }

  if (!promptUtils.isForceMode()) {
    const confirmed = await promptUtils.confirm(
      'Are you sure you want to remove Supabase? This will remove all Supabase-related code.'
    );
    if (!confirmed) {
      logger.info('Operation cancelled');
      process.exit(0);
    }
  }

  const totalSteps = 5;
  let currentStep = 0;

  await backupUtils.withBackup(PATHS_TO_BACKUP, async () => {
    logger.step(++currentStep, totalSteps, 'Removing Supabase client');
    removeSupabaseClient();

    logger.step(++currentStep, totalSteps, 'Removing Supabase environment variables');
    removeSupabaseEnvVars();

    logger.step(++currentStep, totalSteps, 'Cleaning .env.example');
    cleanEnvExample();

    logger.step(++currentStep, totalSteps, 'Removing Supabase dependency');
    packageUtils.removeDependency(SUPABASE_PACKAGE);

    logger.step(++currentStep, totalSteps, 'Creating placeholder repositories');
    if (affectedFeatures.includes('auth')) {
      createPlaceholderAuthRepository();
    }
    if (affectedFeatures.includes('profile')) {
      createPlaceholderProfileRepository();
    }
  });

  logger.divider();
  logger.success('Supabase has been removed successfully!');
  logger.divider();
  logger.info('Next steps:');
  logger.list([
    'Run: npm install',
    'Configure a new backend:',
    '  - npm run add:supabase (to reinstall)',
    '  - npm run add:custom-backend (for REST API)',
  ]);
};

run().catch((error) => {
  logger.error(`Failed: ${error.message}`);
  process.exit(1);
});
