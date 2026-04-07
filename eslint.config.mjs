import cheminfo from 'eslint-config-cheminfo-typescript';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...cheminfo,
  {
    languageOptions: {},
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);
