const glob = require("glob")
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

entry = {}
glob.sync('./src/script/*.js').map(filepath => entry[path.basename(filepath, '.js')] = filepath)

module.exports = {
  entry,
  output: {
    filename: "./script/js/[name].js"
  },
  plugins: [
    new UglifyJsPlugin({
      sourceMap: false
    }),
    new CleanWebpackPlugin(['./script'])
  ]
}