const PropTypes = require('prop-types');
const React = require('react')
const { Paper, FormControlLabel, FormGroup } = require('@material-ui/core')
const Switch = require('../../../Components/Switch')
const settingsActions = require('../../../stores/settings/settingsActions')
const styles = require('../settingStyles')

module.exports = class UISettingsSection extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    ui: PropTypes.object.isRequired,
    os: PropTypes.object.isRequired,
    showRestart: PropTypes.func.isRequired
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const {
      ui,
      os,
      showRestart,
      ...passProps
    } = this.props

    return (
      <div {...passProps}>
        <Paper style={styles.paper}>
          <h1 style={styles.subheading}>User Interface</h1>
          <FormGroup>
          {process.platform !== 'darwin' ? undefined : (
            <FormControlLabel
              control={
                <Switch
                  checked={ui.showTitlebar}
                  onChange={(evt, toggled) => {
                    showRestart()
                    settingsActions.setShowTitlebar(toggled)
                  }}/>
              }
              label='Show titlebar (Requires Restart)'
            />
            )}
          {process.platform === 'darwin' ? undefined : (
            <FormControlLabel
              control={
                <Switch
                  checked={ui.showAppMenu}
                  onChange={(evt, toggled) => settingsActions.setShowAppMenu(toggled)}/>
              }
              label='Show App Menu (Ctrl+\)'
            />
          )}
          <FormControlLabel
            control={
              <Switch
                checked={ui.sidebarEnabled}
                onChange={(evt, toggled) => settingsActions.setEnableSidebar(toggled)}/>
            }
            label={`Show Sidebar (${process.platform === 'darwin' ? 'Ctrl+cmd+S' : 'Ctrl+shift+S'})`}
          />
          <FormControlLabel
            control={
              <Switch
                checked={ui.showAppBadge}
                onChange={(evt, toggled) => settingsActions.setShowAppBadge(toggled)}/>
            }
            label='Show app unread badge'
          />
          <FormControlLabel
            control={
              <Switch
                checked={ui.showTitlebarCount}
                onChange={(evt, toggled) => settingsActions.setShowTitlebarUnreadCount(toggled)}/>
            }
            label='Show titlebar unread count'
          />
          {process.platform === 'darwin' ? (
            <FormControlLabel
              control={
                <Switch
                  checked={os.openLinksInBackground}
                  onChange={(evt, toggled) => settingsActions.setOpenLinksInBackground(toggled)}/>
              }
              label='Open links in background'
            />
            ) : undefined}
          <FormControlLabel
            control={
              <Switch
                checked={ui.openHidden}
                onChange={(evt, toggled) => settingsActions.setOpenHidden(toggled)}/>
            }
            label='Always Start minimized'
          />
          </FormGroup>
        </Paper>
      </div>
    )
  }
}
