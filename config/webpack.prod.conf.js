const webpack = require("webpack")
const glob = require("glob")
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

entry = {}
glob.sync('./src/*.js').map(filepath => entry[path.basename(filepath, '.js')] = filepath)

module.exports = {
  name:'生产编译',
  entry,
  mode: "production",
  output: {
    filename: "./js/[name].js"
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: '"production"'
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: {
          glob:'./@(images|css)/**',
          dot: true
        },
      },
      {
        from: './src/lib/**',
        to: './js/lib',
        flatten: true
      },
      {
        from: './*.html',
      },
      {
        from: './manifest.json',
      }
    ])
  ]
}