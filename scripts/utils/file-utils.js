const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const ROOT_DIR = path.resolve(__dirname, '../..');

const resolvePath = (relativePath) => path.resolve(ROOT_DIR, relativePath);

const readFile = (filePath) => {
  const fullPath = resolvePath(filePath);
  return fs.readFileSync(fullPath, 'utf-8');
};

const writeFile = (filePath, content) => {
  const fullPath = resolvePath(filePath);
  const dir = path.dirname(fullPath);

  if (logger.isDryRun()) {
    logger.dryRun(`Write file: ${filePath}`);
    return;
  }

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, content, 'utf-8');
  logger.success(`Created: ${filePath}`);
};

const deleteFile = (filePath) => {
  const fullPath = resolvePath(filePath);

  if (logger.isDryRun()) {
    logger.dryRun(`Delete file: ${filePath}`);
    return;
  }

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    logger.success(`Deleted: ${filePath}`);
  }
};

const deleteDirectory = (dirPath) => {
  const fullPath = resolvePath(dirPath);

  if (logger.isDryRun()) {
    logger.dryRun(`Delete directory: ${dirPath}`);
    return;
  }

  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    logger.success(`Deleted directory: ${dirPath}`);
  }
};

const copyDirectory = (srcPath, destPath) => {
  const fullSrc = resolvePath(srcPath);
  const fullDest = resolvePath(destPath);

  if (logger.isDryRun()) {
    logger.dryRun(`Copy directory: ${srcPath} → ${destPath}`);
    return;
  }

  fs.cpSync(fullSrc, fullDest, { recursive: true });
  logger.success(`Copied: ${srcPath} → ${destPath}`);
};

const fileExists = (filePath) => {
  const fullPath = resolvePath(filePath);
  return fs.existsSync(fullPath);
};

const directoryExists = (dirPath) => {
  const fullPath = resolvePath(dirPath);
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
};

const findFiles = (pattern, baseDir = '.') => {
  const fullBase = resolvePath(baseDir);
  const results = [];

  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(ROOT_DIR, fullPath);

      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          walk(fullPath);
        }
      } else if (matchPattern(relativePath, pattern)) {
        results.push(relativePath);
      }
    }
  };

  walk(fullBase);
  return results;
};

const matchPattern = (filePath, pattern) => {
  const regexPattern = pattern
    .replace(/\*\*/g, '{{GLOBSTAR}}')
    .replace(/\*/g, '[^/]*')
    .replace(/{{GLOBSTAR}}/g, '.*')
    .replace(/\//g, '\\/');

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(filePath);
};

const replaceInFile = (filePath, search, replace) => {
  const fullPath = resolvePath(filePath);

  if (!fs.existsSync(fullPath)) {
    logger.warning(`File not found: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const newContent = content.replace(search, replace);

  if (content === newContent) {
    logger.warning(`No changes made to: ${filePath}`);
    return false;
  }

  if (logger.isDryRun()) {
    logger.dryRun(`Replace in file: ${filePath}`);
    return true;
  }

  fs.writeFileSync(fullPath, newContent, 'utf-8');
  logger.success(`Modified: ${filePath}`);
  return true;
};

const removeImportLine = (filePath, importPattern) => {
  const fullPath = resolvePath(filePath);

  if (!fs.existsSync(fullPath)) {
    logger.warning(`File not found: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const lines = content.split('\n');
  const filteredLines = lines.filter((line) => !importPattern.test(line));

  if (lines.length === filteredLines.length) {
    return false;
  }

  if (logger.isDryRun()) {
    logger.dryRun(`Remove import from: ${filePath}`);
    return true;
  }

  fs.writeFileSync(fullPath, filteredLines.join('\n'), 'utf-8');
  logger.success(`Removed import from: ${filePath}`);
  return true;
};

const addImportLine = (filePath, importLine, afterPattern = null) => {
  const fullPath = resolvePath(filePath);

  if (!fs.existsSync(fullPath)) {
    logger.warning(`File not found: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');

  if (content.includes(importLine)) {
    return false;
  }

  let newContent;
  if (afterPattern) {
    const lines = content.split('\n');
    const insertIndex = lines.findIndex((line) => afterPattern.test(line));
    if (insertIndex !== -1) {
      lines.splice(insertIndex + 1, 0, importLine);
      newContent = lines.join('\n');
    } else {
      newContent = importLine + '\n' + content;
    }
  } else {
    newContent = importLine + '\n' + content;
  }

  if (logger.isDryRun()) {
    logger.dryRun(`Add import to: ${filePath}`);
    return true;
  }

  fs.writeFileSync(fullPath, newContent, 'utf-8');
  logger.success(`Added import to: ${filePath}`);
  return true;
};

const ensureDirectory = (dirPath) => {
  const fullPath = resolvePath(dirPath);

  if (logger.isDryRun()) {
    logger.dryRun(`Ensure directory: ${dirPath}`);
    return;
  }

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    logger.success(`Created directory: ${dirPath}`);
  }
};

const listDirectory = (dirPath) => {
  const fullPath = resolvePath(dirPath);

  if (!fs.existsSync(fullPath)) {
    return [];
  }

  return fs.readdirSync(fullPath);
};

module.exports = {
  ROOT_DIR,
  resolvePath,
  readFile,
  writeFile,
  deleteFile,
  deleteDirectory,
  copyDirectory,
  fileExists,
  directoryExists,
  findFiles,
  replaceInFile,
  removeImportLine,
  addImportLine,
  ensureDirectory,
  listDirectory,
};
