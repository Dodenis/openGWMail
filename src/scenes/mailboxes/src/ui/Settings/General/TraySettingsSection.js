const PropTypes = require('prop-types');
const React = require('react')
const { Select, Paper, MenuItem, FormControlLabel, InputLabel, FormGroup } = require('@material-ui/core')
const { TrayIconEditor } = require('../../../Components')
const { Switch, FormControlFullWidth } = require('../../../Components/Mui')
const settingsActions = require('../../../stores/settings/settingsActions')
const styles = require('../settingStyles')
const Tray = require('../../Tray')

module.exports = class TraySettingsSection extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    tray: PropTypes.object.isRequired
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const {tray, ...passProps} = this.props

    return (
      <Paper style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>{process.platform === 'darwin' ? 'Menu Bar' : 'Tray'}</h1>
        <div>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={tray.show}
                  onChange={(evt, toggled) => settingsActions.setShowTrayIcon(toggled)}/>
              }
              label='Show icon'
            />
            <FormControlLabel
              control={
                <Switch
                  checked={tray.showUnreadCount}
                  disabled={!tray.show}
                  onChange={(evt, toggled) => settingsActions.setShowTrayUnreadCount(toggled)}/>
              }
              label='Show unread count'
            />
            {Tray.platformSupportsDpiMultiplier() ? (
              <FormControlFullWidth>
                <InputLabel shrink htmlFor="dpi-multiplier">DPI Multiplier</InputLabel>
                <Select
                  inputProps={{
                    id: 'dpi-multiplier',
                  }}
                  value={tray.dpiMultiplier}
                  onChange={(event) => settingsActions.setDpiMultiplier(event.target.value)}
                >
                  <MenuItem value={1}>1x</MenuItem>
                  <MenuItem value={2}>2x</MenuItem>
                  <MenuItem value={3}>3x</MenuItem>
                  <MenuItem value={4}>4x</MenuItem>
                  <MenuItem value={5}>5x</MenuItem>
                </Select>
              </FormControlFullWidth>
            ) : undefined }
          </FormGroup>
        </div>
        <br />
        <TrayIconEditor tray={tray} />
      </Paper>
    )
  }
}
