import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.node, // Node.js globals (process, module, etc.)
        ...globals.es2021,
      },
    },
    plugins: {
      js,
      prettier,
    },
    extends: ['js/recommended', 'plugin:prettier/recommended'],
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'warn',
      'no-undef': 'off',
    },
  },
]);
