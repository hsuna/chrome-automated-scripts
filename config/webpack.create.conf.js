const glob = require("glob")
const path = require('path')

entry = {}
glob.sync('./src/script/*.js').map(filepath => entry[path.basename(filepath, '.js').toLowerCase()] = filepath)

module.exports = {
  name:'构建脚本文件',
  mode: 'production',
  entry,
  output: {
    path: path.resolve(__dirname, '../scripts'),
    filename: "[name].min.js",
    library:'SubScript',
    libraryTarget:'this',
  },
  plugins: [
  ]
}