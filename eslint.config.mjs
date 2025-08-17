import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

export default defineConfig([
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-destructuring': ['error', { object: true, array: false }],
      'import/order': [
        'error',
        {
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: '~/**',
              group: 'internal',
            },
            // React should come first in the external group
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
    },
  }),
]);
