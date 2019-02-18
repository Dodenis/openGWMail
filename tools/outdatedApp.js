// There's a common use-case where we are run before npm install which means
// we don't have all our dev tooling available. In this case patch in a npm
// install first to ensure we have what we need
;(function () {
  const { spawnSync } = require('child_process')
  const path = require('path')
  const fs = require('fs')
  const resolvable = [
    path.join(__dirname, '../node_modules/fs-extra'),
    path.join(__dirname, '../node_modules/colors')
  ]
  const unresolved = resolvable.find((p) => !fs.existsSync(p))
  if (unresolved) {
    // We probably need to run npm install
    console.log('>> Auto-running npm install for support libraries...')
    spawnSync(
      process.platform === 'win32' ? 'npm.cmd' : 'npm',
      ['outdated'],
      {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      }
    )
    console.log('>> ...support libraries installed. Continuing with install:all')
  }
})()

const { spawnSync } = require('child_process')
const { PACKAGE_DIRS } = require('./constants')
const Colors = require('colors/safe')
PACKAGE_DIRS.forEach((dir) => {
  console.log(`${Colors.inverse('npm outdated:')} ${dir}`)
  spawnSync(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['outdated'],
    {
      stdio: 'inherit',
      cwd: dir
    }
  )
})
