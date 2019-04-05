const React = require('react')
const Avatar = require('./Avatar')
const { withStyles } = require('@material-ui/core/styles')

const styles = theme => ({
  root: {
    width: 50,
    height: 50
  }
})

class AvatarAccount extends React.Component {
  render () {
    const {classes, children, ...other} = this.props

    return (
      <Avatar
        classes={{
          root: classes.root
        }}
        {...other}
      >
        {children}
      </Avatar>
    )
  }
}

module.exports = withStyles(styles)(AvatarAccount)
