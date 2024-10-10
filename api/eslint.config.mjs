import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
import babelParser from '@babel/eslint-parser';

import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends('eslint-config-airbnb-base'),
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 'latest',
        requireConfigFile: false,
      },
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['**/*.test.js'],
    languageOptions: { globals: { ...globals.jest } },
  },
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'no-underscore-dangle': 'off',
      'import/no-extraneous-dependencies': [
        'off',
        { devDependencies: true, bundledDependencies: true },
      ],
      'no-console': 'off',
      camelcase: 'off',
    },
  },
  eslintConfigPrettier,
];
