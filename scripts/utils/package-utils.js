const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const PACKAGE_JSON_PATH = path.resolve(__dirname, '../../package.json');

const readPackageJson = () => {
  const content = fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8');
  return JSON.parse(content);
};

const writePackageJson = (content) => {
  if (logger.isDryRun()) {
    logger.dryRun('Write package.json');
    return;
  }

  const formatted = JSON.stringify(content, null, 2) + '\n';
  fs.writeFileSync(PACKAGE_JSON_PATH, formatted, 'utf-8');
  logger.success('Updated: package.json');
};

const addDependency = (name, version, isDev = false) => {
  const pkg = readPackageJson();
  const key = isDev ? 'devDependencies' : 'dependencies';

  if (pkg[key]?.[name]) {
    logger.info(`Dependency ${name} already exists`);
    return false;
  }

  if (logger.isDryRun()) {
    logger.dryRun(`Add ${isDev ? 'dev ' : ''}dependency: ${name}@${version}`);
    return true;
  }

  if (!pkg[key]) {
    pkg[key] = {};
  }

  pkg[key][name] = version;

  const sortedDeps = Object.keys(pkg[key])
    .sort()
    .reduce((acc, k) => {
      acc[k] = pkg[key][k];
      return acc;
    }, {});
  pkg[key] = sortedDeps;

  writePackageJson(pkg);
  logger.success(`Added ${isDev ? 'dev ' : ''}dependency: ${name}@${version}`);
  return true;
};

const removeDependency = (name) => {
  const pkg = readPackageJson();
  let found = false;

  if (pkg.dependencies?.[name]) {
    if (logger.isDryRun()) {
      logger.dryRun(`Remove dependency: ${name}`);
      return true;
    }
    delete pkg.dependencies[name];
    found = true;
  }

  if (pkg.devDependencies?.[name]) {
    if (logger.isDryRun()) {
      logger.dryRun(`Remove devDependency: ${name}`);
      return true;
    }
    delete pkg.devDependencies[name];
    found = true;
  }

  if (found) {
    writePackageJson(pkg);
    logger.success(`Removed dependency: ${name}`);
  }

  return found;
};

const addScript = (name, command) => {
  const pkg = readPackageJson();

  if (pkg.scripts?.[name]) {
    logger.info(`Script ${name} already exists`);
    return false;
  }

  if (logger.isDryRun()) {
    logger.dryRun(`Add script: ${name}`);
    return true;
  }

  if (!pkg.scripts) {
    pkg.scripts = {};
  }

  pkg.scripts[name] = command;
  writePackageJson(pkg);
  logger.success(`Added script: ${name}`);
  return true;
};

const removeScript = (name) => {
  const pkg = readPackageJson();

  if (!pkg.scripts?.[name]) {
    return false;
  }

  if (logger.isDryRun()) {
    logger.dryRun(`Remove script: ${name}`);
    return true;
  }

  delete pkg.scripts[name];
  writePackageJson(pkg);
  logger.success(`Removed script: ${name}`);
  return true;
};

const hasDependency = (name) => {
  const pkg = readPackageJson();
  return !!(pkg.dependencies?.[name] || pkg.devDependencies?.[name]);
};

const hasScript = (name) => {
  const pkg = readPackageJson();
  return !!pkg.scripts?.[name];
};

const getDependencyVersion = (name) => {
  const pkg = readPackageJson();
  return pkg.dependencies?.[name] || pkg.devDependencies?.[name] || null;
};

module.exports = {
  readPackageJson,
  writePackageJson,
  addDependency,
  removeDependency,
  addScript,
  removeScript,
  hasDependency,
  hasScript,
  getDependencyVersion,
};
