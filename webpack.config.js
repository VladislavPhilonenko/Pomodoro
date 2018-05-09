const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/app/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    alias: {
      '@less-helpers-module': path.resolve(__dirname, 'src/assets/less/helpers'),
      '@images-root-path': path.resolve(__dirname, 'src/assets/images')
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader'

      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      },
      {
        test: /\.(jpe?g|png|svg|ttf|eot|woff)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'images/[name].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new CopyWebpackPlugin([
      'src/index.html',
      { from: 'src/static/', to: 'static/' },
      'src/assets/images'
    ]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery'
    })
  ],
  devServer: {
    contentBase: './dist',
    port: 3000
  }
};
