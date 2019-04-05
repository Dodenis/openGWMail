const React = require('react')
const { Avatar: AvatarMui } = require('@material-ui/core')
const { withStyles } = require('@material-ui/core/styles')

const styles = theme => ({
  root: {
    borderWidth: 4,
    borderStyle: 'solid',
    cursor: 'pointer'
  }
})

class Avatar extends React.Component {
  render () {
    const {classes, children, ...other} = this.props

    return (
      <AvatarMui
        classes={{
          root: classes.root
        }}
        {...other}
      >
        {children}
      </AvatarMui>
    )
  }
}

module.exports = withStyles(styles)(Avatar)
