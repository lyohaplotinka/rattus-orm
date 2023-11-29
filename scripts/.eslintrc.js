module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['simple-import-sort'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'error',
    'no-console': 'off',
  },
  overrides: [
    {
      files: ['./**/*.{js,mjs}'],
    },
  ],
  ignorePatterns: ['!scripts/**'],
}
