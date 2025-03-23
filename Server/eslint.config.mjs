import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';

export default [
  { ignores: ['dist', 'node_modules', 'build'] }, // Ignorar archivos innecesarios
  {
    // Configuración para backend
    files: ['Server/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs', // Backend suele usar CommonJS
      globals: globals.node, // Variables globales de Node.js
    },
    plugins: {
      prettier,
    },
    extends: ['plugin:prettier/recommended'], // Activa Prettier automáticamente
    rules: {
      ...js.configs.recommended.rules,
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          endOfLine: 'lf', // LF para evitar problemas de compatibilidad
        },
      ],
    },
  },
];
