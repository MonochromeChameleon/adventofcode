import prettier from 'eslint-plugin-prettier';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [...compat.extends('prettier'), {
  plugins: {
    prettier
  },

  languageOptions: {
    globals: {
      BigInt: true,
      describe: true,
      it: true
    },

    ecmaVersion: 2022,
    sourceType: 'module'
  },

  rules: {
    'no-useless-call': 2,
    'object-shorthand': 2,
    'prefer-arrow-callback': 2,
    'prefer-destructuring': 0,
    'space-infix-ops': 2,
    'class-methods-use-this': 0,
    'no-underscore-dangle': 0,
    'no-bitwise': 0,
    'max-classes-per-file': 0,
    'no-param-reassign': 0,
    'default-case': 0,
    'consistent-return': 0,
    'no-nested-ternary': 0,
    'no-constant-condition': 0
  }
}];
