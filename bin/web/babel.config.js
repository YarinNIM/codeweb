const baseConfig = require('../common/babel.config.js');

const { presets } = baseConfig;

module.exports = {
  ...baseConfig,
  presets: [...presets, '@babel/preset-react'],
};
