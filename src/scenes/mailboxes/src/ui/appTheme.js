'use strict'

const Colors = require('@material-ui/core/colors')

const { createMuiTheme } = require('@material-ui/core/styles')

module.exports = createMuiTheme({
  palette: {
    primary: Colors.blue,
    secondary: Colors.red,
    linkColor: Colors.blue['700']
  }
})
