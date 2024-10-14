import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    rules: {
      'no-unused-vars': 'warn',
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'indent': ['error', 2],
      'eol-last': ['error', 'always'],
    },
  },
  pluginJs.configs.recommended,
];
