const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const argv = require('yargs').argv;
const MarkdownToHTML = require('./MarkdownToHtml');

module.exports = env => {
  const mode = env ? env : 'production';
  return {
    mode,
    entry: './src/js/index',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: './assets/js/app.js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        },
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env']
            }
          }
        }
      ]
    },
    devServer: {
      contentBase: path.join(__dirname, 'build'),
      compress: true,
      port: 3000
    },
    plugins: [
      new CleanWebpackPlugin(['./build']),
      new CopyWebpackPlugin([
        { from: './src/fonts', to: './assets/fonts' },
        { from: './src/img', to: './assets/img' },
        { from: './src/_redirects', to: './_redirects', toType: 'file' },
        { from: './src/favicon.ico', to: './favicon.ico' }
      ]),
      new ExtraWatchWebpackPlugin({
        files: ['./challenges/**/*.md', './src/templates/**/*.njk']
      }),
      new MarkdownToHTML(),
      new MiniCssExtractPlugin({
        filename: 'assets/css/screen.css'
      })
    ]
  };
};
