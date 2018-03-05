"use strict";

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const dotenv = require('dotenv');
const webpack = require('webpack');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleHashWebpackPlugin = require('bundlehash-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

process.noDeprecation = true;


if (fs.existsSync(path.join(__dirname, '.env'))) {
  dotenv.config();
} else {
  console.log('.env file not found, skip dotenv configuration');
}

const bundleEnvVars = Object.keys(process.env).reduce((memo, key) => {
    if (/^BUNDLE_/.test(key)) {
  memo[key] = JSON.stringify(process.env[key]);
}
return memo;
}, {});

module.exports = {

  entry:  {
    app: './src/app'
  },

  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'js/[name].bundle.[hash].js'
  },

  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, 'src'),
    ],
    extensions: ['.js', '.jsx', '.json', '.scss', '.css']
  },

  devtool: 'cheap-module-source-map',

  module: {
    rules: [
      /* JavaScript */
      // {
      //   test: /\.jsx$/,
      //   loader: 'babel-loader',
      //   exclude: /node_modules/,
      //   query: {
      //     cacheDirectory: true,
      //     plugins: ['transform-decorators-legacy', 'add-module-exports'],
      //     presets: ['es2015', 'stage-0', 'react']
      //   }
      // },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/, /jquery/, /\.min\./],
        query: {
          cacheDirectory: true,
          plugins: ['transform-decorators-legacy', 'add-module-exports'],
          presets: ['es2015', 'stage-0', 'react']
        }
      },

      /* Styles */
      { // SCSS styles included in js
        test: /\.scss$/,

        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
              }
            },
            'sass-loader'
          ]
        }),
        include: [
          path.resolve(__dirname, "src")
        ]
      },

      { // SCSS styles
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        }),
        include: [
          path.resolve(__dirname, "stylesheets")
        ]
      },

      {
        test: /\.(png|svg|jpg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=images/[name].[ext]",
      },

      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader']
        }),
      },

      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=fonts/[name].[ext]"
      },

      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=fonts/[name].[ext]",
        include: [
          path.resolve(__dirname, "node_modules/font-awesome")
        ]
      }
    ]
  },

  plugins: _.compact([
    new webpack.DefinePlugin(Object.assign({
      process: {
        env: {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      }
    }, bundleEnvVars)),

    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),

    new ExtractTextPlugin("css/[name].bundle.[hash].css"),

    new CopyWebpackPlugin([
      { from: 'static', to: '' },
    ]),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      mangle: {
        except: ['$super', '$', 'exports', 'require'],
        keep_fnames: true
      },
      warnings: false,
      drop_console:true,
      sourceMap: true
    }),

    new BundleHashWebpackPlugin({
      helpers: {
        'js': function (path) {
          return '<script defer src="' + path + '"></script>'
        }
      },
      file: {
        template: path.join(__dirname, 'static/index.html'),
        target: path.join(__dirname, 'dist/index.html')
      }
    }),

  ]),

  stats: {
    colors: true
  }

};