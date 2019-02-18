const path = require('path')
const ROOT_DIR = path.join(__dirname, '..')
const TOOL_DIR = __dirname
const SRC_DIR = path.join(ROOT_DIR, 'src')
const BIN_DIR = path.join(ROOT_DIR, 'bin')
const DIST_DIR = path.join(ROOT_DIR, 'dist')
const CACHES_DIR = path.join(ROOT_DIR, '.caches')
const PKG = require(path.join(ROOT_DIR, 'package.json'))
const ASSETS_DIR = path.join(ROOT_DIR, 'assets')

module.exports = {
  ROOT_DIR: ROOT_DIR,
  SRC_DIR: SRC_DIR,
  BIN_DIR: BIN_DIR,
  CACHES_DIR: CACHES_DIR,
  ASSETS_DIR: ASSETS_DIR,
  TOOL_DIR: TOOL_DIR,
  DIST_DIR: DIST_DIR,
  INSTALLERS_DIR: path.join(DIST_DIR, 'installers'),
  PKG: PKG,
  REBUILD_PACKAGE_DIRS: [
    path.join(SRC_DIR, 'app')
  ],
  PACKAGE_DIRS: [
    ROOT_DIR,
    path.join(SRC_DIR, 'app'),
    path.join(SRC_DIR, 'scenes/mailboxes')
  ]
}
