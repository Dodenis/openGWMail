const React = require('react')
const { Badge } = require('@material-ui/core')
const { withStyles } = require('@material-ui/core/styles')

const styles = theme => ({
  badge: {
    top: 6,
    right: 6
  }
})

class BadgeAvatar extends React.Component {
  render () {
    const {classes, children, ...other} = this.props

    return (
      <Badge
        classes={{
          badge: classes.badge
        }}
        {...other}
      >
        {children}
      </Badge>
    )
  }
}

module.exports = withStyles(styles)(BadgeAvatar)
