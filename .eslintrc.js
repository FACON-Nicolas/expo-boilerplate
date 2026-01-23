module.exports = {
  root: true,
  extends: [
    'expo',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:boundaries/strict',
  ],
  plugins: [
    '@typescript-eslint',
    'import',
    'boundaries',
    'no-relative-import-paths',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
    'boundaries/elements': [
      { type: 'app', pattern: 'app/**' },
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
          ],
    'boundaries/ignore': [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '__tests__/**/*',
    ],
  },
  ignorePatterns: [
    '/dist/*',
    '/node_modules/*',
    '/.expo/*',
    '/android/*',
    '/ios/*',
    'babel.config.js',
    'metro.config.js',
    'tailwind.config.js',
    'jest.config.js',
    'commitlint.config.js',
    '.eslintrc.js',
    '*.d.ts',
  ],
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
              'core-domain',
              'core-data',
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
              'infrastructure',
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
            allow: ['core-domain', 'infrastructure'],
          },
          {
            from: 'infrastructure',
            allow: ['core-domain'],
          },
          {
            from: 'core-presentation',
            allow: ['core-domain', 'core-data', 'ui', 'i18n'],
          },
          {
            from: 'ui',
            allow: ['ui', 'core-domain', 'core-presentation', 'core-data'],
          },
          {
            from: 'i18n',
            allow: ['i18n'],
          },
          {
            from: 'scripts',
            allow: ['*'],
          },
        ],
      },
    ],

    'import/order': [
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

    'import/no-duplicates': 'error',
    'import/no-unresolved': 'error',
    'import/no-cycle': 'error',

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
  },
  overrides: [
    {
      files: ['i18n/**/*.ts'],
      rules: {
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
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
  ],
};
