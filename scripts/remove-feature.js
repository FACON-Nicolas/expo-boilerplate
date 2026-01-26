#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const fileUtils = require('./utils/file-utils');
const templateUtils = require('./utils/template-utils');
const promptUtils = require('./utils/prompt-utils');
const backupUtils = require('./utils/backup-utils');

const CONFIG_PATH = path.resolve(__dirname, './config/features.json');

const loadFeaturesConfig = () => {
  if (fs.existsSync(CONFIG_PATH)) {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  }
  return {};
};

const checkDependents = (featureName, config) => {
  const dependents = [];
  for (const [name, feature] of Object.entries(config)) {
    if (feature.dependencies && feature.dependencies.includes(featureName)) {
      dependents.push(name);
    }
  }
  return dependents;
};

const run = async () => {
  logger.header('Remove Feature');

  let featureName = promptUtils.getArg(0);

  if (!featureName) {
    featureName = await promptUtils.input('Feature name to remove');
  }

  if (!featureName) {
    logger.error('Feature name is required');
    process.exit(1);
  }

  const kebabName = templateUtils.toKebabCase(featureName);
  const featurePath = `features/${kebabName}`;
  const testPath = `__tests__/features/${kebabName}`;

  if (!fileUtils.directoryExists(featurePath)) {
    logger.error(`Feature "${kebabName}" does not exist`);
    process.exit(1);
  }

  const config = loadFeaturesConfig();
  const dependents = checkDependents(kebabName, config);

  if (dependents.length > 0) {
    logger.warning(`The following features depend on "${kebabName}": ${dependents.join(', ')}`);
    const removeDependents = await promptUtils.confirm('Do you want to remove them as well?');

    if (removeDependents) {
      for (const dependent of dependents) {
        logger.info(`Removing dependent feature: ${dependent}`);
        fileUtils.deleteDirectory(`features/${dependent}`);
        fileUtils.deleteDirectory(`__tests__/features/${dependent}`);
      }
    } else {
      logger.warning('Proceeding anyway. Dependent features may break.');
    }
  }

  if (!promptUtils.isForceMode()) {
    const confirmed = await promptUtils.confirm(
      `Are you sure you want to remove the "${kebabName}" feature?`
    );
    if (!confirmed) {
      logger.info('Operation cancelled');
      process.exit(0);
    }
  }

  const pathsToBackup = [featurePath];
  if (fileUtils.directoryExists(testPath)) {
    pathsToBackup.push(testPath);
  }

  await backupUtils.withBackup(pathsToBackup, async () => {
    logger.step(1, 2, `Removing ${featurePath}`);
    fileUtils.deleteDirectory(featurePath);

    logger.step(2, 2, `Removing ${testPath}`);
    if (fileUtils.directoryExists(testPath)) {
      fileUtils.deleteDirectory(testPath);
    }
  });

  logger.divider();
  logger.success(`Feature "${kebabName}" removed successfully!`);
};

run().catch((error) => {
  logger.error(`Failed: ${error.message}`);
  process.exit(1);
});
