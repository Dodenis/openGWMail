const React = require('react')
const { Switch, Paper, SelectField, MenuItem } = require('@material-ui/core')
const platformActions = require('../../../stores/platform/platformActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')

const LOGIN_OPEN_MODES = {
  OFF: 'false|false',
  ON: 'true|false',
  ON_BACKGROUND: 'true|true'
}

module.exports = React.createClass({
  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  displayName: 'PlatformSettingsSection',
  propTypes: {
    mailtoLinkHandlerSupported: React.PropTypes.bool.isRequired,
    isMailtoLinkHandler: React.PropTypes.bool.isRequired,
    openAtLoginSupported: React.PropTypes.bool.isRequired,
    openAtLogin: React.PropTypes.bool.isRequired,
    openAsHiddenAtLogin: React.PropTypes.bool.isRequired
  },

  /* **************************************************************************/
  // UI Events
  /* **************************************************************************/

  /**
  * Handles the open at login state chaning
  */
  handleOpenAtLoginChanged (evt, index, value) {
    switch (value) {
      case LOGIN_OPEN_MODES.OFF:
        platformActions.changeLoginPref(false, false)
        break
      case LOGIN_OPEN_MODES.ON:
        platformActions.changeLoginPref(true, false)
        break
      case LOGIN_OPEN_MODES.ON_BACKGROUND:
        platformActions.changeLoginPref(true, true)
        break
    }
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const {
      mailtoLinkHandlerSupported,
      isMailtoLinkHandler,
      openAtLoginSupported,
      openAtLogin,
      openAsHiddenAtLogin,
      ...passProps
    } = this.props

    if (!mailtoLinkHandlerSupported && !openAtLoginSupported) { return null }

    return (
      <Paper zDepth={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Platform</h1>
        {mailtoLinkHandlerSupported ? (
          <Switch
            checked={isMailtoLinkHandler}
            labelPosition='right'
            label='Handle mailto links'
            onChange={(evt, toggled) => platformActions.changeMailtoLinkHandler(toggled)} />
        ) : undefined}
        {openAtLoginSupported ? (
          <SelectField
            fullWidth
            floatingLabelText='Open at Login'
            onChange={this.handleOpenAtLoginChanged}
            value={`${openAtLogin}|${openAsHiddenAtLogin}`}>
            <MenuItem value={LOGIN_OPEN_MODES.OFF}>{'Don\'t open at login'}</MenuItem>
            <MenuItem value={LOGIN_OPEN_MODES.ON}>Open at login</MenuItem>
            <MenuItem value={LOGIN_OPEN_MODES.ON_BACKGROUND}>Open at login (in background)</MenuItem>
          </SelectField>
        ) : undefined}
      </Paper>
    )
  }
})
