'use strict';

require('dotenv').config();

const webpack = require('webpack');
const path = require('path');

const { ASSETS_HOST, ASSETS_PORT } = process.env;
console.log(`ASSETS_HOST = "${ASSETS_HOST}"`);
console.log(`ASSETS_PORT = "${ASSETS_PORT}"`);

const bundleEnvVars = Object.keys(process.env).reduce((memo, key) => {
  if (/^BUNDLE_/.test(key)) {
    memo[key] = JSON.stringify(process.env[key]);
  }

  return memo;
}, {});

process.noDeprecation = true;

module.exports = {

  devServer: {
    historyApiFallback: true,
    publicPath: '/',
    contentBase: path.resolve(__dirname, 'static'),
    https: false,
    hot: true,

    host: ASSETS_HOST,
    port: ASSETS_PORT,

    disableHostCheck: true,

    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },

  entry:  {
    app: './src/app'
  },

  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'js/[name].bundle.js'
  },

  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, 'src'),
    ],
    extensions: ['.js', '.jsx', '.json', '.scss', '.css']
  },

  devtool: 'inline-source-map',

  module: {
    rules: [
      /* JavaScript */
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'stage-0', 'react'],
          plugins: [
            'transform-decorators-legacy',
            'add-module-exports',
            ["react-transform", {
              transforms: [
                {
                  transform: 'react-transform-hmr',
                  imports: ['react'],
                  locals: ['module']
                }
              ]
            }]
          ],
        }
      },
      {
        test: /\.js$/,
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

        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
          'sass-loader'
        ],
        include: [
          path.resolve(__dirname, "src"),
        ]
      },

      { // SCSS styles
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: [path.resolve(__dirname, "stylesheets")]
      },

      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },

      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=fonts/[name].[ext]"
      },

      {
        test: /\.(ttf|eot|svg|jpg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=images/[name].[ext]",
        options: {
          include: [
            path.resolve(__dirname, "node_modules/font-awesome")
          ]
        }
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.DefinePlugin(Object.assign({
      process: {
        env: {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      }
    }, bundleEnvVars)),

    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
  ],

  stats: {
    colors: true
  }

};
