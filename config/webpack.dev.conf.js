const webpack = require('webpack')
const glob = require("glob")
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

entry = {}
glob.sync('./src/*.js').map(filepath => entry[path.basename(filepath, '.js')] = filepath)

module.exports = {
  name:'开发编译',
  entry,
  mode: "development",
  output: {
    path: path.resolve(__dirname, '../js'),
    filename: "[name].js"
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: './src/lib/**',
        to: './lib',
        flatten: true
      },
    ])
  ]
}