const fs = require('fs-extra')
const path = require('path')
const { ROOT_PATH } = require('./constants')

class ReleaseAssets {

  /**
  * Copies the assets into the releases folders
  * @param platforms: the platforms to build for
  * @return promise
  */
  static copyAssetsIntoReleases (platforms) {
    const platformsSet = new Set(platforms)
    if (platformsSet.has('darwin')) {
      fs.copySync(path.join(__dirname, 'dmg/First Run.html'), path.join(ROOT_PATH, 'openGWMail-darwin-x64/First Run.html'))
    }
    if (platformsSet.has('linux')) {
      fs.copySync(path.join(ROOT_PATH, 'assets/icons/app.png'), path.join(ROOT_PATH, 'openGWMail-linux-ia32/icon.png'))
      fs.copySync(path.join(ROOT_PATH, 'assets/icons/app.png'), path.join(ROOT_PATH, 'openGWMail-linux-x64/icon.png'))
      fs.copySync(path.join(__dirname, 'linux/opengwmail.desktop'), path.join(ROOT_PATH, 'openGWMail-linux-ia32/opengwmail.desktop'))
      fs.copySync(path.join(__dirname, 'linux/opengwmail.desktop'), path.join(ROOT_PATH, 'openGWMail-linux-x64/opengwmail.desktop'))
    }

    return Promise.resolve()
  }
}

module.exports = ReleaseAssets
