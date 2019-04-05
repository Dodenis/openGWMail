const React = require('react')
const { Badge: MuiBadge } = require('@material-ui/core')
const { withStyles } = require('@material-ui/core/styles')

const styles = theme => ({
  badge: {
    top: 6,
    right: 6
  }
})

class Badge extends React.Component {
  render () {
    const {classes, children, ...other} = this.props

    return (
      <MuiBadge
        classes={{
          badge: classes.badge
        }}
        {...other}
      >
        {children}
      </MuiBadge>
    )
  }
}

module.exports = withStyles(styles)(Badge)
