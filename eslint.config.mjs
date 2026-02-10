import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default [
   {
    ignores: ['mongo/insert_books.mongodb.js'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    //determines the files that are targeted only .ts files
    files: ['**/*.ts'],
    //rule fore unused vars and params starting with _ allowed
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
];
