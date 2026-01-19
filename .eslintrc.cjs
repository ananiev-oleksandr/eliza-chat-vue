module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
      '@vue/eslint-config-typescript',
      '@vue/eslint-config-prettier',
    ],
    parserOptions: {
      ecmaVersion: 'latest',
    },
    rules: {
      'no-unused-vars': 'warn',
      'vue/multi-word-component-names': 'off', 
    },
  };
