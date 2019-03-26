const React = require('react')
const { Switch, Paper } = require('@material-ui/core')
const settingsActions = require('../../../stores/settings/settingsActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')

module.exports = React.createClass({
  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  displayName: 'NotificationSettingsSection',
  propTypes: {
    os: React.PropTypes.object.isRequired
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { os, ...passProps } = this.props

    return (
      <Paper zDepth={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Notifications</h1>
        <Switch
          checked={os.notificationsEnabled}
          labelPosition='right'
          label='Show new mail notifications'
          onChange={(evt, toggled) => settingsActions.setNotificationsEnabled(toggled)} />
        <Switch
          checked={!os.notificationsSilent}
          label='Play notification sound'
          labelPosition='right'
          disabled={!os.notificationsEnabled}
          onChange={(evt, toggled) => settingsActions.setNotificationsSilent(!toggled)} />
      </Paper>
    )
  }
})
