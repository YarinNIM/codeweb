const { getRules, getSettings, getPlugins } = require('./eslint');

const ignorePatterns = [
  'build',
  '__test__',
];

module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: getPlugins(),
  rules: getRules(),
  settings: getSettings(),
  ignorePatterns,
};
