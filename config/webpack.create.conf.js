const glob = require("glob")
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

entry = {}
glob.sync('./src/script/*.js').map(filepath => entry[path.basename(filepath, '.js')] = filepath)

module.exports = {
  entry,
  output: {
    filename: "./scripts/[name].min.js"
  },
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          sequences     : false,  // join consecutive statemets with the “comma operator”
          side_effects  : false,  // drop side-effect-free statements
        },
      },
      sourceMap: false
    }),
    new CleanWebpackPlugin(['./scripts'])
  ]
}