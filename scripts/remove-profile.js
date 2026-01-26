#!/usr/bin/env node

const logger = require('./utils/logger');
const fileUtils = require('./utils/file-utils');
const promptUtils = require('./utils/prompt-utils');
const backupUtils = require('./utils/backup-utils');

const PATHS_TO_BACKUP = [
  'features/profile',
  '__tests__/features/profile',
];

const run = async () => {
  logger.header('Remove Profile Feature');

  if (!fileUtils.directoryExists('features/profile')) {
    logger.warning('Profile feature is not installed');
    process.exit(0);
  }

  if (!promptUtils.isForceMode()) {
    const confirmed = await promptUtils.confirm(
      'Are you sure you want to remove the profile feature?'
    );
    if (!confirmed) {
      logger.info('Operation cancelled');
      process.exit(0);
    }
  }

  const totalSteps = 2;
  let currentStep = 0;

  await backupUtils.withBackup(PATHS_TO_BACKUP, async () => {
    logger.step(++currentStep, totalSteps, 'Removing profile feature');
    fileUtils.deleteDirectory('features/profile');

    logger.step(++currentStep, totalSteps, 'Removing profile tests');
    fileUtils.deleteDirectory('__tests__/features/profile');
  });

  logger.divider();
  logger.success('Profile feature has been removed successfully!');
  logger.divider();
  logger.info('Next steps:');
  logger.list([
    'Remove any profile-related routes if present',
    'Remove profile imports from other files',
    'Run npm run lint to check for broken imports',
  ]);
};

run().catch((error) => {
  logger.error(`Failed: ${error.message}`);
  process.exit(1);
});
