const React = require('react')
const { Switch: MuiSwitch } = require('@material-ui/core')
const { withStyles } = require('@material-ui/core/styles')

const styles = theme => ({
  switchBase: {
    height: 30
  }
})

class Switch extends React.Component {
  render () {
    const {classes, ...other} = this.props

    return (
      <MuiSwitch
        classes={{
          switchBase: classes.switchBase
        }}
        {...other}
      />
    )
  }
}

Switch.defaultProps = {
  color: 'primary'
}

module.exports = withStyles(styles)(Switch)
