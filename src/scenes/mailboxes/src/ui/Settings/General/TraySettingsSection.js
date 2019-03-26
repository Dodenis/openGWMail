const React = require('react')
const { Switch, Paper, SelectField, MenuItem } = require('@material-ui/core')
const { TrayIconEditor } = require('../../../Components')
const settingsActions = require('../../../stores/settings/settingsActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')
const Tray = require('../../Tray')

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'TraySettingsSection',
  propTypes: {
    tray: React.PropTypes.object.isRequired
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const {tray, ...passProps} = this.props

    return (
      <Paper zDepth={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>{process.platform === 'darwin' ? 'Menu Bar' : 'Tray'}</h1>
        <div>
          <Switch
            checked={tray.show}
            label='Show icon'
            labelPosition='right'
            onChange={(evt, toggled) => settingsActions.setShowTrayIcon(toggled)} />
          <Switch
            checked={tray.showUnreadCount}
            label='Show unread count'
            labelPosition='right'
            disabled={!tray.show}
            onChange={(evt, toggled) => settingsActions.setShowTrayUnreadCount(toggled)} />
          {Tray.platformSupportsDpiMultiplier() ? (
            <SelectField
              floatingLabelText='DPI Multiplier'
              value={tray.dpiMultiplier}
              onChange={(evt, index, value) => settingsActions.setDpiMultiplier(value)}>
              <MenuItem value={1}>1x</MenuItem>
              <MenuItem value={2}>2x</MenuItem>
              <MenuItem value={3}>3x</MenuItem>
              <MenuItem value={4}>4x</MenuItem>
              <MenuItem value={5}>5x</MenuItem>
            </SelectField>
          ) : undefined }
        </div>
        <br />
        <TrayIconEditor tray={tray} />
      </Paper>
    )
  }
})
