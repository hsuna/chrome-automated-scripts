const webpack = require('webpack')
const glob = require("glob")
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

entry = {}
glob.sync('./src/*.js').map(filepath => entry[path.basename(filepath, '.js')] = filepath)

module.exports = {
  entry,
  output: {
    filename: "./js/[name].js"
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: './src/lib/**',
        to: './js/lib',
        flatten: true
      },
    ])
  ]
}