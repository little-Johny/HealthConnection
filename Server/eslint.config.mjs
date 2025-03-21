import js from '@eslint/js'
import globals from 'globals'

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
    rules: {
      ...js.configs.recommended.rules,
    },
  },

]
