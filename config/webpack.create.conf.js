const glob = require("glob")
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

entry = {}
glob.sync('./src/script/*.js').map(filepath => entry[path.basename(filepath, '.js').toLowerCase()] = filepath)

module.exports = {
  entry,
  output: {
    filename: "./scripts/[name].min.js",
    libraryTarget:'umd'
  },
  plugins: [
    new UglifyJsPlugin({
      sourceMap: false
    }),
    new CleanWebpackPlugin(['./scripts'])
  ]
}