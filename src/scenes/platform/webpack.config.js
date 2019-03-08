const path = require('path')
const ROOT_DIR = path.resolve(path.join(__dirname, '../../../'))
const BIN_DIR = path.join(ROOT_DIR, 'bin')
const OUT_DIR = path.join(BIN_DIR, 'scenes/platform')
const devRequire = (n) => require(path.join(ROOT_DIR, 'node_modules', n))

const CleanWebpackPlugin = devRequire('clean-webpack-plugin')
const CopyWebpackPlugin = devRequire('copy-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV,
  output: {
    path: OUT_DIR,
    filename: '__.js'
  },
  entry: path.join(__dirname, '__.js'),
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: path.join(__dirname, 'src'), to: '', force: true }
    ], {
      ignore: [ '.DS_Store' ]
    })
  ]
}
