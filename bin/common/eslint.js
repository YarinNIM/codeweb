const getSettings = ({ extensions = [] } = {}) => ({
  'import/resolver': {
    node: {
      extensions: ['.ts', '.js', ...extensions],
      moduleDirectories: ['node_modules'],
    },
    alias: {
      extensions: ['.ts', '.js', ...extensions],
      map: [['@', './src']],
    },
  },
});

const getRules = (rules = {}) => {
  const { extensions = {}, ...rest } = rules;
  return {
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      ts: 'never',
      ...extensions,
    }],
    ...rest,
  };
};

const getPlugins = (plugins = []) => ([
  '@typescript-eslint',
  'eslint-plugin-tsdoc',
  ...plugins,
]);

module.exports = {
  getSettings,
  getRules,
  getPlugins,
};
