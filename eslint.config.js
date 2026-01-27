import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import boundaries from 'eslint-plugin-boundaries';
import importX from 'eslint-plugin-import-x';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.expo/**',
      'android/**',
      'ios/**',
      'coverage/**',
      'scripts/**/*.js',
      'babel.config.js',
      'metro.config.cjs',
      'tailwind.config.js',
      'jest.config.cjs',
      'jest.setup.ts',
      'commitlint.config.cjs',
      '**/*.d.ts',
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'import-x': importX,
      boundaries,
      'no-relative-import-paths': noRelativeImportPaths,
      'react-hooks': reactHooks,
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: './tsconfig.json',
        }),
      ],
      'boundaries/elements': [
        { type: 'app', pattern: 'app/**' },
        { type: 'core-config', pattern: 'core/config/**' },
        { type: 'core-domain', pattern: 'core/domain/**' },
        { type: 'core-data', pattern: 'core/data/**' },
        { type: 'core-presentation', pattern: 'core/presentation/**' },
        { type: 'infrastructure', pattern: 'infrastructure/**' },
        { type: 'feature-domain', pattern: 'features/*/domain/**' },
        { type: 'feature-data', pattern: 'features/*/data/**' },
        { type: 'feature-presentation', pattern: 'features/*/presentation/**' },
        { type: 'ui', pattern: 'ui/**' },
        { type: 'i18n', pattern: 'i18n/**' },
        { type: 'scripts', pattern: 'scripts/**' },
        { type: 'tests', pattern: '__tests__/**' },
        { type: 'mocks', pattern: '__mocks__/**' },
      ],
      'boundaries/ignore': [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
      ],
    },
    rules: {
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        {
          allowSameFolder: false,
          rootDir: '.',
          prefix: '@',
        },
      ],

      '@typescript-eslint/no-require-imports': 'error',

      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
          filter: {
            regex: '^(handle|manage|process)[A-Z]',
            match: false,
          },
        },
        {
          selector: 'variable',
          types: ['function'],
          format: ['camelCase', 'PascalCase'],
          filter: {
            regex: '^(handle|manage|process)[A-Z]',
            match: false,
          },
        },
      ],

      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: 'app',
              allow: [
                'feature-presentation',
                'feature-domain',
                'feature-data',
                'core-config',
                'core-domain',
                'core-data',
                'core-presentation',
                'infrastructure',
                'ui',
                'i18n',
              ],
            },
            {
              from: 'feature-domain',
              allow: ['feature-domain', 'core-domain'],
            },
            {
              from: 'feature-data',
              allow: [
                'feature-domain',
                'core-domain',
                'core-data',
                'infrastructure',
              ],
            },
            {
              from: 'feature-presentation',
              allow: [
                'feature-presentation',
                'feature-domain',
                'feature-data',
                'core-domain',
                'core-data',
                'core-presentation',
                'ui',
                'i18n',
              ],
            },
            {
              from: 'core-domain',
              allow: ['core-domain', 'i18n'],
            },
            {
              from: 'core-data',
              allow: ['core-domain', 'core-data'],
            },
            {
              from: 'core-config',
              allow: ['core-domain'],
            },
            {
              from: 'infrastructure',
              allow: ['core-config', 'core-data', 'infrastructure'],
            },
            {
              from: 'core-presentation',
              allow: ['core-domain', 'core-data', 'core-presentation', 'ui', 'i18n'],
            },
            {
              from: 'ui',
              allow: ['ui', 'core-domain', 'core-presentation'],
            },
            {
              from: 'i18n',
              allow: ['i18n'],
            },
            {
              from: 'scripts',
              allow: ['*'],
            },
            {
              from: 'tests',
              allow: ['*'],
            },
            {
              from: 'mocks',
              allow: ['*'],
            },
          ],
        },
      ],

      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'import-x/no-duplicates': 'error',
      'import-x/no-unresolved': 'off',
      'import-x/no-cycle': 'error',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  {
    files: ['i18n/**/*.ts'],
    rules: {
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
    },
  },
  {
    files: ['app/_layout.tsx'],
    rules: {
      'boundaries/no-unknown': 'off',
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
          filter: {
            regex: '^(handle|manage|process)[A-Z]',
            match: false,
          },
        },
        {
          selector: 'variable',
          types: ['function'],
          format: ['camelCase', 'PascalCase'],
          filter: {
            regex: '^(handle(?!Submit|Change)|manage|process)[A-Z]',
            match: false,
          },
        },
      ],
    },
  },
);
