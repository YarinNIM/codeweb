const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

// const isWindowsOS = process.platform === 'win32';
// const where = path.resolve(__dirname, '/src');

const rules = [
  {
    test: /\.(js|jsx|ts|tsx)$/,
    use: ['babel-loader'],
    exclude: /node_modules/,
  },
  {
    test: /\.(jpe?g|gif|png|svg|pdf)$/i,
    type: 'asset/resource',
    exclude: /node_modules/,
  },
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader', 'postcss-loader'],
  },
];

const getEnv = () => {
  const env = { 'process.env': JSON.stringify(process.env) };
  return new webpack.DefinePlugin(env);
};

const getAppName = () => {
  if (!process.env?.BASE_URL) {
    throw new Error('Please provide BASE_URL environment variable.');
  }

  const baseRrl = new URL(process.env?.BASE_URL || '');
  const hostname = baseRrl.hostname || '';
  const appName = hostname.split('.')?.[0];
  return appName;
};

const devConfig = (mode) => {
  if (mode === 'production') {
    return { optimization: { minimize: true } };
  }

  return {
    devtool: 'inline-source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
        publicPath: '/',
      },
      port: process.env.APP_PORT || 8888,
      hot: true,
      historyApiFallback: true,
    },
  };
};

const getOutput = () => {
  const toPath = path.resolve('./public');

  return {
    path: toPath,
    filename: `js/[name]-${getAppName()}-[chunkhash].bundle.js`,
    assetModuleFilename: 'assets/[name].[hash][ext][query]',
  };
};

module.exports = (env, { mode }) => {
  // const basePath = process.env.BASE_PATH || '/';
  const srcPath = path.resolve('./src');

  console.log(`Env: ${mode}`);
  console.log(`Source Dir: ${srcPath}`);

  return {
    mode,
    entry: './src/Main.tsx',
    output: getOutput(),
    module: { rules },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      alias: { '@': srcPath },
    },
    target: ['web', 'es5'],
    plugins: [
      getEnv(),
      new CopyWebpackPlugin({
        patterns: ['./src/manifest.json'],
      }),
      new HtmlWebpackPlugin({
        // base: basePath,
        title: process.env.APP_TITLE,
        template: './src/index.html',
        filename: './index.html',
      }),
    ],
    ...devConfig(mode),
  };
};
