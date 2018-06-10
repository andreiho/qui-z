const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const dotenv = require('dotenv');

// Import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

const outputDirectory = 'dist';

module.exports = {
  entry: './src/client/index.js',
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ 'es2015', 'react', 'stage-3' ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg/,
        use: {
          loader: 'svg-url-loader',
          options: {}
      }
    }
    ]
  },
  devtool: 'source-map',
  devServer: {
    port: process.env.CLIENT_PORT,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/api': `http://localhost:${process.env.SERVER_PORT}`
    }
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico'
    })
  ]
};
