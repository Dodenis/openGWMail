const { PACKAGE_DIRS } = require('./constants')
const rimraf = require('rimraf')

PACKAGE_DIRS.forEach((dir) => {
  console.log('Clean:' + dir)
  rimraf(
    dir + '/node_modules/!(rimraf|.bin)',
    function (err) {
      if (err) {
        console.log(err)
      }
    }
  )
})
