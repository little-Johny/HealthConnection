import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['dist', 'node_modules', 'build'],
  },
  {
    files: ['*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: globals.node,
    },
    plugins: { prettier },
    extends: [
      js.configs.recommended,
      'plugin:prettier/recommended',
    ],
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          endOfLine: 'lf',
        },
      ],
    },
  },
  {
    files: ['Server/**/*.{js,cjs,mjs}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: globals.node,
    },
    plugins: { prettier },
    extends: [
      js.configs.recommended,
      'plugin:prettier/recommended',
    ],
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          endOfLine: 'lf',
        },
      ],
    },
  },
];
