const packager = require('electron-packager')
const TaskLogger = require('./TaskLogger')
const path = require('path')
const { ROOT_PATH, DIST_PATH} = require('./constants')
const { rebuild } = require('electron-rebuild')
const { serialHooks } = require('electron-packager/hooks')

const PLATFORM_ARCHES = {
  darwin: ['x64'],
  linux: ['x64', 'ia32'],
  win32: ['x64', 'ia32']
}

class ElectronBuilder {

  /**
  * @return the string that defines the items to ignore
  */
  static packagerIgnoreString (platform, arch) {
    const ignores = [
      // Folders
      '/assets',
      '/github_images',
      '/node_modules',
      '/release',
      '/src',
      '/packager',
      '/dist',

      // Files
      '/.editorconfig',
      '/.gitignore',
      '/.travis.yml',
      '/.LICENSE',
      '/.npm-debug.log',
      '/packager.js',
      '/README.md',
      '/webpack.config.js',

      // Output folders
      '/openGWMail-linux-ia32',
      '/openGWMail-linux-x64',
      '/openGWMail-win32-ia32',
      '/openGWMail-win32-x64',
      '/openGWMail-darwin-x64'
    ]

    return '^(' + ignores.join('|') + ')'
  }

  /**
  * Packages a single platform and arch
  * @param platform: the platform string
  * @param arch: the arch
  * @param pkg: the package to build for
  * @return promise
  */
  static packageSinglePlatformArch (platform, arch, pkg) {
    return new Promise((resolve, reject) => {
      const options = {
        dir: ROOT_PATH,
        out: DIST_PATH,
        name: 'openGWMail',
        executableName: 'opengwmail',
        platform: platform,
        arch: arch,
        appBundleId: 'opengwmail.opengwmail',
        appCopyright: 'Copyright ' + pkg.author + '(' + pkg.license + ' License)',
        icon: path.join(ROOT_PATH, 'assets/icons/app'),
        overwrite: true,
        asar: true,
        prune: false,
        'version-string': {
          CompanyName: pkg.author,
          FileDescription: pkg.description,
          OriginalFilename: pkg.name,
          ProductName: 'openGWMail'
        },
        extendInfo: {
          'CFBundleURLSchemes': ['mailto']
        },
        ignore: ElectronBuilder.packagerIgnoreString(platform, arch),
        afterCopy: [serialHooks([
          (buildPath, electronVersion, platform, arch) => {
            buildPath = path.join(buildPath, 'bin/app')
            rebuild({ buildPath, electronVersion, arch })
          }
        ])]
      }

      packager(options)
        .then(() => resolve())
        .catch(err => reject(err))
    })
  }

  /**
  * Pacakges the electron app
  * @param platforms: the platforms to package for
  * @param pkg: the package to read version etc from
  * @return promise on completion
  */
  static packageApp (platforms, pkg) {
    const task = TaskLogger.start('Package Electron')
    const tasks = platforms.reduce((acc, platform) => {
      return acc.concat(PLATFORM_ARCHES[platform].map((arch) => {
        return { platform: platform, arch: arch }
      }))
    }, [])

    return Promise.resolve()
      .then(() => {
        return tasks.reduce((acc, { platform, arch }) => {
          return acc.then(() => ElectronBuilder.packageSinglePlatformArch(platform, arch, pkg))
        }, Promise.resolve())
      })
      .then(() => task.finish(), (err) => task.fail(err))
  }
}

module.exports = ElectronBuilder
