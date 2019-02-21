const fs = require('fs-extra')
const path = require('path')
const { ASSETS_DIR, DIST_DIR, PLATFORM_ARCHES_FOLDERS } = require('../constants')

class ReleaseAssets {

  /**
  * Copies the assets into the releases folders
  * @param platforms: the platforms to build for
  * @return promise
  */
  static copyAssetsIntoReleases (platforms) {
    const platformsSet = new Set(platforms)
    if (platformsSet.has('darwin')) {
      fs.copySync(path.join(__dirname, 'dmg', 'First Run.html'), path.join(DIST_DIR, PLATFORM_ARCHES_FOLDERS['darwin']['x64'], 'First Run.html'))
    }
    if (platformsSet.has('linux')) {
      fs.copySync(path.join(ASSETS_DIR, 'icons', 'app.png'), path.join(DIST_DIR, PLATFORM_ARCHES_FOLDERS['linux']['x86'], 'icon.png'))
      fs.copySync(path.join(ASSETS_DIR, 'icons', 'app.png'), path.join(DIST_DIR, PLATFORM_ARCHES_FOLDERS['linux']['x64'], 'icon.png'))
      fs.copySync(path.join(__dirname, 'linux', 'opengwmail.desktop'), path.join(DIST_DIR, PLATFORM_ARCHES_FOLDERS['linux']['x86'], 'opengwmail.desktop'))
      fs.copySync(path.join(__dirname, 'linux', 'opengwmail.desktop'), path.join(DIST_DIR, PLATFORM_ARCHES_FOLDERS['linux']['x64'], 'opengwmail.desktop'))
    }

    return Promise.resolve()
  }
}

module.exports = ReleaseAssets
