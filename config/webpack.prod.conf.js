const webpack = require("webpack")
const glob = require("glob")
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

entry = {}
glob.sync('./src/*.js').map(filepath => entry[path.basename(filepath, '.js')] = filepath)

module.exports = {
  entry,
  output: {
    filename: "./dist/js/[name].js"
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: '"production"'
    }),
    new UglifyJsPlugin({
      sourceMap: false
    }),
    new CleanWebpackPlugin(['./dist']),
    new CopyWebpackPlugin([
      {
        from: {
          glob:'./@(images|css)/**',
          dot: true
        },
        to: 'dist'
      },
      {
        from: './src/lib/**',
        to: 'dist/js/lib',
        flatten: true
      },
      {
        from: './*.html',
        to: 'dist',
      },
      {
        from: './manifest.json',
        to:'dist'
      }
    ])
  ]
}