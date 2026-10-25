const js = require('@eslint/js');
const globals = require('globals');
const pluginCypress = require('eslint-plugin-cypress');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  {
    ignores: ['node_modules/**', 'reports/**', 'cypress/screenshots/**', 'cypress/videos/**'],
  },
  js.configs.recommended,
  {
    files: ['*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
  {
    files: ['cypress/**/*.js'],
    ...pluginCypress.configs.recommended,
    languageOptions: {
      ...pluginCypress.configs.recommended.languageOptions,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...pluginCypress.configs.recommended.languageOptions?.globals,
      },
    },
    rules: {
      ...pluginCypress.configs.recommended.rules,
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/no-force': 'warn',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
  prettierConfig,
];
