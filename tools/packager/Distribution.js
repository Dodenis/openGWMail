const { DIST_DIR, ASSETS_DIR, INSTALLERS_DIR, TOOL_DIR, PLATFORM_ARCHES_FOLDERS } = require('../constants')
const appdmg = process.platform === 'darwin' ? require('appdmg') : undefined
const path = require('path')
const fs = require('fs-extra')
const childProcess = require('child_process')
const TaskLogger = require('./TaskLogger')
const debianInstaller = require('electron-installer-debian')
const windowsInstaller = require('electron-installer-windows')
const temp = require('temp')
temp.track()

const ARCH = { X86: 'x86', X64: 'x64' }
const ARCH_FILENAME = { 'x86': 'ia32', 'x64': 'x86_64' }

class Distribution {
  /**
  * Distributes the darin version of the app
  * @param pkg: the package info
  * @return promise
  */
  static distributeDarwin (pkg) {
    if (process.platform !== 'darwin') {
      return Promise.reject(new Error('Darwin distribution only supported from darwin'))
    }

    return new Promise((resolve, reject) => {
      const task = TaskLogger.start('OSX DMG')

      const filename = `${pkg.productName}_${pkg.version.replace(/\./g, '_')}${pkg.prerelease ? '_prerelease' : ''}_osx.dmg`
      const targetPath = path.join(INSTALLERS_DIR, filename)
      fs.mkdirsSync(INSTALLERS_DIR)
      if (fs.existsSync(targetPath)) {
        fs.removeSync(targetPath)
      }

      const packagedPath = path.join(DIST_DIR, PLATFORM_ARCHES_FOLDERS['darwin'][ARCH.X64])

      fs.copySync(path.join(ASSETS_DIR, 'icons', 'app.icns'), path.join(packagedPath, 'app.icns'))
      fs.copySync(path.join(__dirname, 'dmg', 'background.png'), path.join(packagedPath, 'background.png'))

      const dmgCreate = appdmg({
        target: targetPath,
        basepath: packagedPath,
        specification: {
          title: `${pkg.productName} ${pkg.version} ${pkg.prerelease ? 'Prerelease' : ''}`,
          format: 'UDBZ',
          icon: 'app.icns',
          'background-color': '#CCCCCC',
          background: 'background.png',
          'icon-size': 100,
          window: {
            size: { width: 600, height: 500 }
          },
          contents: [
            { x: 150, y: 100, type: 'file', path: pkg.productName + '.app' },
            { x: 450, y: 100, type: 'link', path: '/Applications' },
            { x: 150, y: 400, type: 'file', path: 'First Run.html' },
            { x: 300, y: 400, type: 'file', path: 'LICENSE' },
            { x: 450, y: 400, type: 'file', path: 'vendor-licenses' }
          ]
        }
      })
      dmgCreate.on('finish', () => {
        task.finish()
        resolve()
      })
      dmgCreate.on('error', (err) => {
        task.fail()
        reject(err)
      })
    })
  }

  /**
   * Distributes the windows version of the app
   * @param pkg: the package info
   * @param arch: one of 'x86' or 'x64'
   * @return promise
   */
  static distributeWindows (pkg, arch) {
    const ARCH_MAPPING = { x86: 'i386', x64: 'amd64' }
    const CWD_MAPPING = {
      x86: path.join(DIST_DIR, PLATFORM_ARCHES_FOLDERS['win32'][ARCH.X86]),
      x64: path.join(DIST_DIR, PLATFORM_ARCHES_FOLDERS['win32'][ARCH.X64])
    }

    return new Promise((resolve, reject) => {
      const task = TaskLogger.start(`Windows exe (${arch})`)

      const options = {
        src: CWD_MAPPING[arch],
        dest: INSTALLERS_DIR,
        rename: function (dest, src) {
          const ext = path.extname(src)

          if (ext === '.exe' || ext === '.msi') {
            const fileName = pkg.productName
            const fileVersion = pkg.version.replace(/\./g, '_')
            const fileRelease = `${pkg.prerelease ? '_prerelease' : ''}_win32`

            src = fileName + '_' + fileVersion + fileRelease + '_' + ARCH_MAPPING[arch] + ext
          }

          return path.join(dest, src)
        },
        options: {
          name: pkg.name,
          productName: pkg.productName,
          description: pkg.description,
          productDescription: pkg.description,
          version: pkg.version,
          copyright: 'Copyright ' + pkg.author.name + '(' + pkg.license + ' License)',
          authors: [pkg.author.name],
          owners: [pkg.author.name],
          homepage: pkg.homepage,
          animation: path.join(TOOL_DIR, 'packager', 'msi', 'loader.gif'),
          icon: path.join(ASSETS_DIR, 'icons', 'app.ico'),
          iconUrl: 'https://github.com/Dodenis/openGWMail/raw/master/assets/icons/app.png'
        }
      }

      windowsInstaller(options)
        .then(() => {
          task.finish()
          resolve()
        })
        .catch(err => {
          task.fail()
          reject(err)
        })
    })
  }

  /**
  * Distributes the app for linux
  * @param pkg: the package info
  * @param arch: one of 'x86' or 'x64'
  * @return promise
  */
  static distributeLinuxTar (pkg, arch) {
    return new Promise((resolve, reject) => {
      const task = TaskLogger.start(`Linux tar (${arch})`)

      const filename = `openGWMail_${pkg.version.replace(/\./g, '_')}${pkg.prerelease ? '_prerelease' : ''}_linux_${ARCH_FILENAME[arch]}.tar.gz`
      const targetPath = path.join(DIST_DIR, filename)
      const builtDirectory = PLATFORM_ARCHES_FOLDERS['linux'][arch]

      if (fs.existsSync(targetPath)) {
        fs.removeSync(targetPath)
      }

      const cmd = `cd ${DIST_DIR}; tar czf "${targetPath}" "${builtDirectory}"`
      childProcess.exec(cmd, {}, (error, stdout, stderr) => {
        if (error) { console.error(error) }
        if (stdout) { console.log(`stdout: ${stdout}`) }
        if (stderr) { console.log(`stderr: ${stderr}`) }

        if (error) { task.fail(); reject(); return }

        task.finish()
        resolve()
      })
    })
  }

  /**
  * Distributes the app for linux (.deb package)
  * @param pkg: the package info
  * @param arch: one of 'x86' or 'x64'
  * @return promise
  */
  static distributeLinuxDeb (pkg, arch) {
    const ARCH_MAPPING = { x86: 'i386', x64: 'amd64' }
    const CWD_MAPPING = {
      x86: path.join(DIST_DIR, PLATFORM_ARCHES_FOLDERS['linux'][ARCH.X86]),
      x64: path.join(DIST_DIR, PLATFORM_ARCHES_FOLDERS['linux'][ARCH.X64])
    }

    return new Promise((resolve, reject) => {
      const task = TaskLogger.start(`Linux deb (${arch})`)

      const options = {
        src: CWD_MAPPING[arch],
        dest: INSTALLERS_DIR,
        arch: ARCH_MAPPING[arch],
        rename: function (dest, src) {
          const fileName = pkg.humanName
          const fileVersion = pkg.version.replace(/\./g, '_')
          const fileRelease = `${pkg.prerelease ? '_prerelease' : ''}_linux`
          return path.join(
            dest,
            fileName + '_' + fileVersion + fileRelease + '_<%= arch %>.deb'
          )
        },
        options: require(path.join(__dirname, 'deb', 'config.json'))
      }

      debianInstaller(options)
        .then(() => {
          task.finish()
          resolve()
        })
        .catch(err => {
          task.fail()
          reject(err)
        })
    })
  }

  /**
  * Distributes the app for the given platforms
  * @param platforms: the platforms to distribute for
  * @param pkg: the package info
  * @return promise
  */
  static distribute (platforms, pkg) {
    return platforms.reduce((acc, platform) => {
      if (platform === 'darwin') {
        return acc.then(() => Distribution.distributeDarwin(pkg))
      } else if (platform === 'win32') {
        return acc
          .then(() => Distribution.distributeWindows(pkg, ARCH.X86))
          .then(() => Distribution.distributeWindows(pkg, ARCH.X64))
      } else if (platform === 'linux') {
        return acc
          .then(() => Distribution.distributeLinuxTar(pkg, ARCH.X86))
          .then(() => Distribution.distributeLinuxDeb(pkg, ARCH.X86))
          .then(() => Distribution.distributeLinuxTar(pkg, ARCH.X64))
          .then(() => Distribution.distributeLinuxDeb(pkg, ARCH.X64))
      } else {
        return acc
      }
    }, Promise.resolve())
  }

  /**
  * Finalises the distrubiton of the apps for the given platforms
  * @param platforms: the platforms to finalise for
  * @param pkg: the package info
  * @return promise
  */
  static finaliseDistribute (platforms, pkg) {
    return platforms.reduce((acc, platform) => {
      return acc
    }, Promise.resolve())
  }
}

module.exports = Distribution
