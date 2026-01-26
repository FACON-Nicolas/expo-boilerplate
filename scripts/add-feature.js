#!/usr/bin/env node

const logger = require('./utils/logger');
const fileUtils = require('./utils/file-utils');
const templateUtils = require('./utils/template-utils');
const promptUtils = require('./utils/prompt-utils');

const createFeatureStructure = (featureName) => {
  const kebabName = templateUtils.toKebabCase(featureName);
  const pascalName = templateUtils.toPascalCase(featureName);
  const camelName = templateUtils.toCamelCase(featureName);

  const basePath = `features/${kebabName}`;
  const testPath = `__tests__/features/${kebabName}`;

  const directories = [
    `${basePath}/domain/entities`,
    `${basePath}/domain/repositories`,
    `${basePath}/domain/usecases`,
    `${basePath}/domain/validation`,
    `${basePath}/data/repositories`,
    `${basePath}/presentation/hooks`,
    `${testPath}/domain/usecases`,
    `${testPath}/presentation/hooks`,
  ];

  directories.forEach((dir) => {
    fileUtils.ensureDirectory(dir);
  });

  const validationContent = `import { z } from 'zod';

export const ${camelName}Schema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const create${pascalName}Schema = z.object({
});
`;
  fileUtils.writeFile(`${basePath}/domain/validation/${kebabName}-schema.ts`, validationContent);

  const entityContent = `import type { ${camelName}Schema, create${pascalName}Schema } from '@/features/${kebabName}/domain/validation/${kebabName}-schema';

import type { z } from 'zod';

export type ${pascalName} = z.infer<typeof ${camelName}Schema>;
export type Create${pascalName}Input = z.infer<typeof create${pascalName}Schema>;
`;
  fileUtils.writeFile(`${basePath}/domain/entities/${kebabName}.ts`, entityContent);

  const repositoryContent = `import type { ${pascalName}, Create${pascalName}Input } from '@/features/${kebabName}/domain/entities/${kebabName}';

export interface ${pascalName}Repository {
  fetch${pascalName}(id: string): Promise<${pascalName} | null>;
  create${pascalName}(input: Create${pascalName}Input): Promise<${pascalName}>;
  update${pascalName}(id: string, input: Partial<Create${pascalName}Input>): Promise<${pascalName}>;
  delete${pascalName}(id: string): Promise<void>;
}
`;
  fileUtils.writeFile(`${basePath}/domain/repositories/${kebabName}-repository.ts`, repositoryContent);

  const placeholderRepoContent = `import type { ${pascalName}Repository } from '@/features/${kebabName}/domain/repositories/${kebabName}-repository';

export const createPlaceholder${pascalName}Repository = (): ${pascalName}Repository => ({
  fetch${pascalName}: async () => {
    throw new Error('Not implemented');
  },
  create${pascalName}: async () => {
    throw new Error('Not implemented');
  },
  update${pascalName}: async () => {
    throw new Error('Not implemented');
  },
  delete${pascalName}: async () => {
    throw new Error('Not implemented');
  },
});
`;
  fileUtils.writeFile(`${basePath}/data/repositories/placeholder-${kebabName}-repository.ts`, placeholderRepoContent);

  fileUtils.writeFile(`${basePath}/domain/usecases/.gitkeep`, '');
  fileUtils.writeFile(`${basePath}/presentation/hooks/.gitkeep`, '');

  return { basePath, testPath, pascalName, kebabName };
};

const run = async () => {
  logger.header('Add Feature');

  let featureName = promptUtils.getArg(0);

  if (!featureName) {
    featureName = await promptUtils.input('Feature name (e.g., settings, notifications)');
  }

  if (!featureName) {
    logger.error('Feature name is required');
    process.exit(1);
  }

  const kebabName = templateUtils.toKebabCase(featureName);

  if (fileUtils.directoryExists(`features/${kebabName}`)) {
    logger.warning(`Feature "${kebabName}" already exists`);
    const shouldOverwrite = await promptUtils.confirm('Do you want to overwrite it?');
    if (!shouldOverwrite) {
      logger.info('Operation cancelled');
      process.exit(0);
    }
    fileUtils.deleteDirectory(`features/${kebabName}`);
    fileUtils.deleteDirectory(`__tests__/features/${kebabName}`);
  }

  logger.info(`Creating feature: ${kebabName}`);
  logger.divider();

  const result = createFeatureStructure(featureName);

  logger.divider();
  logger.success(`Feature "${result.kebabName}" created successfully!`);
  logger.divider();
  logger.info('Created structure:');
  logger.list([
    `${result.basePath}/domain/validation/${result.kebabName}-schema.ts`,
    `${result.basePath}/domain/entities/${result.kebabName}.ts`,
    `${result.basePath}/domain/repositories/${result.kebabName}-repository.ts`,
    `${result.basePath}/data/repositories/placeholder-${result.kebabName}-repository.ts`,
    `${result.basePath}/domain/usecases/`,
    `${result.basePath}/presentation/hooks/`,
    `${result.testPath}/`,
  ]);
  logger.divider();
  logger.info('Next steps:');
  logger.list([
    'Add properties to the Zod schemas in validation/',
    'Create usecases',
    'Implement repository with your backend',
    'Add presentation hooks',
  ]);
};

run().catch((error) => {
  logger.error(`Failed: ${error.message}`);
  process.exit(1);
});
