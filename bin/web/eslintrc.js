const { getSettings, getRules } = require('../common/eslint');
const base = require('../common/eslintrc.base');

const settings = getSettings({ extensions: ['.tsx', '.jsx'] });

const rules = getRules({
  extensions: {
    tsx: 'never',
    jsx: 'never',
  },
  'import/no-extraneous-dependencies': ['error', {
    packageDir: '../../packages/web-config/build',
  }]
});

console.log({ rules });

module.exports = {
  ...base,
  rules,
  settings,
};
