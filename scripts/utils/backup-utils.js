const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const fileUtils = require('./file-utils');

const BACKUP_DIR = path.resolve(__dirname, '../.backups');

const generateBackupId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `backup-${timestamp}-${random}`;
};

const createBackup = (paths) => {
  const backupId = generateBackupId();
  const backupPath = path.join(BACKUP_DIR, backupId);

  if (logger.isDryRun()) {
    logger.dryRun(`Create backup: ${backupId}`);
    return backupId;
  }

  fs.mkdirSync(backupPath, { recursive: true });

  const manifest = {
    id: backupId,
    timestamp: new Date().toISOString(),
    files: [],
  };

  for (const relativePath of paths) {
    const sourcePath = fileUtils.resolvePath(relativePath);

    if (!fs.existsSync(sourcePath)) {
      continue;
    }

    const destPath = path.join(backupPath, relativePath);
    const destDir = path.dirname(destPath);

    fs.mkdirSync(destDir, { recursive: true });

    const stat = fs.statSync(sourcePath);
    if (stat.isDirectory()) {
      fs.cpSync(sourcePath, destPath, { recursive: true });
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }

    manifest.files.push({
      path: relativePath,
      isDirectory: stat.isDirectory(),
    });
  }

  fs.writeFileSync(
    path.join(backupPath, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  logger.info(`Backup created: ${backupId}`);
  return backupId;
};

const restoreBackup = (backupId) => {
  const backupPath = path.join(BACKUP_DIR, backupId);
  const manifestPath = path.join(backupPath, 'manifest.json');

  if (!fs.existsSync(manifestPath)) {
    logger.error(`Backup not found: ${backupId}`);
    return false;
  }

  if (logger.isDryRun()) {
    logger.dryRun(`Restore backup: ${backupId}`);
    return true;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  for (const file of manifest.files) {
    const sourcePath = path.join(backupPath, file.path);
    const destPath = fileUtils.resolvePath(file.path);
    const destDir = path.dirname(destPath);

    fs.mkdirSync(destDir, { recursive: true });

    if (file.isDirectory) {
      if (fs.existsSync(destPath)) {
        fs.rmSync(destPath, { recursive: true, force: true });
      }
      fs.cpSync(sourcePath, destPath, { recursive: true });
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }

  logger.success(`Restored backup: ${backupId}`);
  return true;
};

const cleanupBackup = (backupId) => {
  const backupPath = path.join(BACKUP_DIR, backupId);

  if (logger.isDryRun()) {
    logger.dryRun(`Cleanup backup: ${backupId}`);
    return;
  }

  if (fs.existsSync(backupPath)) {
    fs.rmSync(backupPath, { recursive: true, force: true });
    logger.info(`Cleaned up backup: ${backupId}`);
  }
};

const withBackup = async (paths, operation) => {
  if (logger.isDryRun()) {
    logger.dryRun('Backup would be created for: ' + paths.join(', '));
    await operation();
    return;
  }

  const backupId = createBackup(paths);

  try {
    await operation();
    cleanupBackup(backupId);
  } catch (error) {
    logger.error(`Operation failed: ${error.message}`);
    logger.warning('Restoring from backup...');
    restoreBackup(backupId);
    cleanupBackup(backupId);
    throw error;
  }
};

const listBackups = () => {
  if (!fs.existsSync(BACKUP_DIR)) {
    return [];
  }

  const entries = fs.readdirSync(BACKUP_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => {
      const manifestPath = path.join(BACKUP_DIR, e.name, 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        return manifest;
      }
      return null;
    })
    .filter(Boolean);
};

module.exports = {
  createBackup,
  restoreBackup,
  cleanupBackup,
  withBackup,
  listBackups,
};
