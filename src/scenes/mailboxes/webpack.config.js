const path = require('path')
const ROOT_DIR = path.resolve(path.join(__dirname, '../../../'))
const BIN_DIR = path.join(ROOT_DIR, 'bin')
const OUT_DIR = path.join(BIN_DIR, 'scenes/mailboxes')
const devRequire = (n) => require(path.join(ROOT_DIR, 'node_modules', n))

const webpack = devRequire('webpack')
const CopyWebpackPlugin = devRequire('copy-webpack-plugin')
const CleanWebpackPlugin = devRequire('clean-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

const options = {
  mode: process.env.NODE_ENV,
  devtool: isProduction ? undefined : (process.env.WEBPACK_DEVTOOL || 'source-map'),
  entry: {
    mailboxes: [
      path.join(__dirname, 'src')
    ]
  },
  output: {
    path: OUT_DIR,
    filename: 'mailboxes.js'
  },
  plugins: [
    // Clean out our bin dir
    new CleanWebpackPlugin(),

    // Ignore electron modules and other modules we don't want to compile in
    new webpack.IgnorePlugin(new RegExp('^(electron)$')),

    // Copy our static assets
    new CopyWebpackPlugin([
      { from: path.join(__dirname, 'src/mailboxes.html'), to: 'mailboxes.html', force: true },
      { from: path.join(__dirname, 'src/offline.html'), to: 'offline.html', force: true },
      { from: path.join(__dirname, 'src/notification.html'), to: 'notification.html', force: true }
    ], {
      ignore: [ '.DS_Store' ]
    })
  ].filter((p) => !!p),
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.css'],
    alias: {
      shared: path.resolve(path.join(__dirname, '../../shared'))
    },
    modules: [
      __dirname,
      path.resolve(path.join(__dirname, 'src')),
      path.join(__dirname, 'node_modules')
    ]
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        include: [
          __dirname,
          path.resolve(path.join(__dirname, '../../shared'))
        ],
        exclude: /node_modules/,
        options: {
          cacheDirectory: true,
          presets: ['env', 'react', 'stage-0']
        }
      },
      {
        test: /(\.less|\.css)$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  },
  target: 'electron-renderer'
}

module.exports = options
