const React = require('react')
const { Switch, Paper } = require('@material-ui/core')
const settingsActions = require('../../../stores/settings/settingsActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'UISettingsSection',
  propTypes: {
    ui: React.PropTypes.object.isRequired,
    os: React.PropTypes.object.isRequired,
    showRestart: React.PropTypes.func.isRequired
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const {
      ui,
      os,
      showRestart,
      ...passProps
    } = this.props

    return (
      <div {...passProps}>
        <Paper zDepth={1} style={styles.paper}>
          <h1 style={styles.subheading}>User Interface</h1>
          {process.platform !== 'darwin' ? undefined : (
            <Switch
              labelPosition='right'
              checked={ui.showTitlebar}
              label='Show titlebar (Requires Restart)'
              onChange={(evt, toggled) => {
                showRestart()
                settingsActions.setShowTitlebar(toggled)
              }} />
            )}
          {process.platform === 'darwin' ? undefined : (
            <Switch
              labelPosition='right'
              checked={ui.showAppMenu}
              label='Show App Menu (Ctrl+\)'
              onChange={(evt, toggled) => settingsActions.setShowAppMenu(toggled)} />
          )}
          <Switch
            checked={ui.sidebarEnabled}
            label={`Show Sidebar (${process.platform === 'darwin' ? 'Ctrl+cmd+S' : 'Ctrl+shift+S'})`}
            labelPosition='right'
            onChange={(evt, toggled) => settingsActions.setEnableSidebar(toggled)} />
          <Switch
            checked={ui.showAppBadge}
            label='Show app unread badge'
            labelPosition='right'
            onChange={(evt, toggled) => settingsActions.setShowAppBadge(toggled)} />
          <Switch
            checked={ui.showTitlebarCount}
            label='Show titlebar unread count'
            labelPosition='right'
            onChange={(evt, toggled) => settingsActions.setShowTitlebarUnreadCount(toggled)} />
          {process.platform === 'darwin' ? (
            <Switch
              checked={os.openLinksInBackground}
              label='Open links in background'
              labelPosition='right'
              onChange={(evt, toggled) => settingsActions.setOpenLinksInBackground(toggled)} />
            ) : undefined}
          <Switch
            checked={ui.openHidden}
            label='Always Start minimized'
            labelPosition='right'
            onChange={(evt, toggled) => settingsActions.setOpenHidden(toggled)} />
        </Paper>
      </div>
    )
  }
})
