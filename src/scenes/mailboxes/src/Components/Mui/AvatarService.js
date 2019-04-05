const React = require('react')
const Avatar = require('./Avatar')
const { withStyles } = require('@material-ui/core/styles')

const styles = theme => ({
  active: {
    width: 35,
    height: 35,
    display: 'block',
    margin: '4px auto',
    borderWidth: 3
  },
  inactive: {
    width: 35,
    height: 35,
    display: 'block',
    margin: '4px auto',
    borderWidth: 3,
    opacity: 0.8
  },
  compactActive: {
    margin: 2,
    width: 18,
    height: 18,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: 'transparent'
  },
  compactInactive: {
    margin: 2,
    width: 18,
    height: 18,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: 'transparent',
    opacity: 0.7,
    filter: 'grayscale(25%)'
  }
})

class AvatarService extends React.Component {
  render () {
    const {classes, children, compact, active, ...other} = this.props

    const classAvatar = (compact ? (active ? classes.compactActive : classes.compactInactive) : (active ? classes.active : classes.inactive))

    return (
      <Avatar
        classes={{
          root: classAvatar
        }}
        {...other}
      >
        {children}
      </Avatar>
    )
  }
}

AvatarService.defaultProps = {
  active: true,
  compact: false
}

module.exports = withStyles(styles)(AvatarService)
