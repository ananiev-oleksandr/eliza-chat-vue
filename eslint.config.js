import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';  
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import vue from 'eslint-plugin-vue'; 
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/essential'],
  prettier,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
    },
    rules: {
      // Vue
      'vue/no-undef-components': 'error',
      'vue/no-mutating-props': 'error',
      'vue/no-use-v-if-with-v-for': 'error',
      'vue/require-v-for-key': 'error',
      'vue/multi-word-component-names': 'off',
    
      // Base JS
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    
      // TS
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // Imports
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-duplicates': 'error',
    },
  }
);
