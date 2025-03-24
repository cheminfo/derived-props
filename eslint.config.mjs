import cheminfo from 'eslint-config-cheminfo-typescript';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...cheminfo,
  {
    languageOptions: {},
    rules: {},
  },
]);
