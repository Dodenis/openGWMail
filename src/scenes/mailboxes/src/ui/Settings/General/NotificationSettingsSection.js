const PropTypes = require('prop-types');
const React = require('react')
const { Paper, FormControlLabel, FormGroup } = require('@material-ui/core')
const Switch = require('../../../Components/Switch')
const settingsActions = require('../../../stores/settings/settingsActions')
const styles = require('../settingStyles')

module.exports = class NotificationSettingsSection extends React.PureComponent {
  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  static propTypes = {
    os: PropTypes.object.isRequired
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { os, ...passProps } = this.props

    return (
      <Paper style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Notifications</h1>
        <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={os.notificationsEnabled}
              onChange={(evt, toggled) => settingsActions.setNotificationsEnabled(toggled)}/>
          }
          label='Show new mail notifications'
        />
        <FormControlLabel
          control={
            <Switch
              checked={!os.notificationsSilent}
              disabled={!os.notificationsEnabled}
              onChange={(evt, toggled) => settingsActions.setNotificationsSilent(!toggled)}/>
          }
          label='Play notification sound'
        />
        </FormGroup>
      </Paper>
    )
  }
}
