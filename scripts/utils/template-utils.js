const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const fileUtils = require('./file-utils');

const TEMPLATES_DIR = path.resolve(__dirname, '../templates');

const loadTemplate = (templatePath) => {
  const fullPath = path.join(TEMPLATES_DIR, templatePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  return fs.readFileSync(fullPath, 'utf-8');
};

const renderTemplate = (template, variables) => {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(placeholder, value);
  }

  return result;
};

const renderTemplateFile = (templatePath, variables) => {
  const template = loadTemplate(templatePath);
  return renderTemplate(template, variables);
};

const generateFromTemplate = (templatePath, outputPath, variables = {}) => {
  const content = renderTemplateFile(templatePath, variables);

  if (logger.isDryRun()) {
    logger.dryRun(`Generate from template: ${templatePath} → ${outputPath}`);
    return;
  }

  fileUtils.writeFile(outputPath, content);
};

const copyTemplateDirectory = (templateDir, outputDir, variables = {}) => {
  const fullTemplateDir = path.join(TEMPLATES_DIR, templateDir);

  if (!fs.existsSync(fullTemplateDir)) {
    throw new Error(`Template directory not found: ${templateDir}`);
  }

  const walk = (dir, relativeDir = '') => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const templatePath = path.join(dir, entry.name);
      const relativePath = path.join(relativeDir, entry.name);

      if (entry.isDirectory()) {
        walk(templatePath, relativePath);
      } else {
        const content = fs.readFileSync(templatePath, 'utf-8');
        const rendered = renderTemplate(content, variables);

        let outputFileName = entry.name.replace(/\.template$/, '');
        outputFileName = renderTemplate(outputFileName, variables);

        const outputPath = path.join(outputDir, relativeDir, outputFileName);

        if (logger.isDryRun()) {
          logger.dryRun(`Generate: ${outputPath}`);
        } else {
          fileUtils.writeFile(outputPath, rendered);
        }
      }
    }
  };

  walk(fullTemplateDir);
};

const templateExists = (templatePath) => {
  const fullPath = path.join(TEMPLATES_DIR, templatePath);
  return fs.existsSync(fullPath);
};

const listTemplates = (dir = '') => {
  const fullDir = path.join(TEMPLATES_DIR, dir);

  if (!fs.existsSync(fullDir)) {
    return [];
  }

  return fs.readdirSync(fullDir, { withFileTypes: true }).map((entry) => ({
    name: entry.name,
    isDirectory: entry.isDirectory(),
    path: path.join(dir, entry.name),
  }));
};

const toPascalCase = (str) => {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

const toCamelCase = (str) => {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

const toKebabCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

module.exports = {
  loadTemplate,
  renderTemplate,
  renderTemplateFile,
  generateFromTemplate,
  copyTemplateDirectory,
  templateExists,
  listTemplates,
  toPascalCase,
  toCamelCase,
  toKebabCase,
  TEMPLATES_DIR,
};
