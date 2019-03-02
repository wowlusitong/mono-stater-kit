const path = require('path');

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const basePath = path.resolve(__dirname, 'src');

module.exports = {
  context: basePath,
  mode: process.env.NODE_ENV,
  entry: {
    main: ['./scripts/main.js', './styles/main.css'],
  },
  output: {
    filename: 'bundle-[hash].js',
    path: path.resolve(__dirname, 'dist/assets'),
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(['dist/assets']),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [{
          loader: 'babel-loader',
          options: {
            root: '../../',
          },
        }],
        include: `${basePath}/scripts`,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  devServer: {
    quiet: true,
    hot: true,
    open: true,
    historyApiFallback: true,
    port: 3001,
  },
};
