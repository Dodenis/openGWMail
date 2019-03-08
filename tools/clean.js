const { PACKAGE_DIRS } = require('./constants')
const rimraf = require('rimraf')
const fs = require('fs')

const rmCustom = function (folder) {
  const folderContents = fs.readdirSync(folder)

  folderContents.forEach(content => {
    if (content === '.bin') {
      rmCustom(folder + '/' + content)
    } else if (content !== 'rimraf') {
      rimraf(
        folder + '/' + content,
        function (err) {
          if (err) {
            console.log(err)
          }
        }
      )
    }
  })
}

PACKAGE_DIRS.forEach((dir) => {
  console.log('Clean: ' + dir)
  rmCustom(dir + '/node_modules')
})
