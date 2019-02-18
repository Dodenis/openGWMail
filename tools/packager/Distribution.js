const { ROOT_DIR, DIST_DIR, INSTALLERS_DIR } = require('../constants')
const appdmg = process.platform === 'darwin' ? require('appdmg') : undefined
const path = require('path')
const fs = require('fs-extra')
const childProcess = require('child_process')
const TaskLogger = require('./TaskLogger')
const uuid = require('uuid')
const debianInstaller = require('electron-installer-debian')
const windowsInstaller = require('electron-installer-windows')
const recursiveReaddir = require('recursive-readdir')
const temp = require('temp')
temp.track()
const { WINDOWS_UPGRADE_CODE } = require('../../src/shared/credentials')

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
      const filename = `openGWMail_${pkg.version.replace(/\./g, '_')}${pkg.prerelease ? '_prerelease' : ''}_osx.dmg`
      const distPath = DIST_DIR
      const targetPath = path.join(distPath, filename)
      fs.mkdirsSync(distPath)
      if (fs.existsSync(targetPath)) {
        fs.removeSync(targetPath)
      }

      const dmgCreate = appdmg({
        target: targetPath,
        basepath: ROOT_DIR,
        specification: {
          title: `openGWMail ${pkg.version} ${pkg.prerelease ? 'Prerelease' : ''}`,
          format: 'UDBZ',
          icon: 'assets/icons/app.icns',
          'background-color': '#CCCCCC',
          background: path.join(__dirname, 'dmg/background.png'),
          'icon-size': 100,
          window: {
            size: { width: 600, height: 500 }
          },
          contents: [
            { x: 150, y: 100, type: 'file', path: 'openGWMail-darwin-x64/openGWMail.app' },
            { x: 450, y: 100, type: 'link', path: '/Applications' },
            { x: 150, y: 400, type: 'file', path: 'openGWMail-darwin-x64/First Run.html' },
            { x: 300, y: 400, type: 'file', path: 'openGWMail-darwin-x64/LICENSE' },
            { x: 450, y: 400, type: 'file', path: 'openGWMail-darwin-x64/vendor-licenses' }
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
      x86: path.join(DIST_DIR, 'openGWMail-win32-ia32'),
      x64: path.join(DIST_DIR, 'openGWMail-win32-x64')
    }

    return new Promise((resolve, reject) => {
      const task = TaskLogger.start(`Windows exe (${arch})`)

      const options = {
        src: CWD_MAPPING[arch],
        dest: INSTALLERS_DIR,
        arch: ARCH_MAPPING[arch],
        rename: function (dest, src) {
          const fileName = pkg.humanName
          const fileVersion = pkg.version.replace(/\./g, '_')
          const fileRelease = `${pkg.prerelease ? '_prerelease' : ''}_win32`
          const ext = path.extname(src)
          if (ext === '.exe' || ext === '.msi') {
            src = fileName + '_' + fileVersion + fileRelease + '_<%= arch %>' + ext
          }

          return path.join(dest, src)
        },
        options: require(path.join(__dirname, 'msi/config.json'))
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
      const builtDirectory = arch === ARCH.X64 ? 'openGWMail-linux-x64' : 'openGWMail-linux-ia32'

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
      x86: path.join(DIST_DIR, 'openGWMail-linux-ia32'),
      x64: path.join(DIST_DIR, 'openGWMail-linux-x64')
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
        options: require(path.join(__dirname, 'deb/config.json'))
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
