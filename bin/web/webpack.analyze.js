const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const baseConfig = require('./webpack.base.js');

const analyzePlugin = (args) => {
  const { analyze = false } = args;
  if (!analyze) return undefined;
  return new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerPort: 8085,
    openAnalyzer: true,
  });
};

module.exports = (_, args) => {
  const { plugins, ...rest } = baseConfig(_, args);

  return {
    ...rest,
    plugins: [
      ...plugins,
      analyzePlugin(args),
    ].filter(Boolean),
  };
};
