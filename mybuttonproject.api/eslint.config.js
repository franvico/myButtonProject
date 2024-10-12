import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    rules: {
      // Agrega las reglas que desees
      'no-unused-vars': 'warn', // Muestra advertencias si hay variables no utilizadas
      'quotes': ['error', 'single'], // Fuerza el uso de comillas simples
      'semi': ['error', 'always'], // Requiere punto y coma al final de las líneas
    },
  },
  pluginJs.configs.recommended,
];