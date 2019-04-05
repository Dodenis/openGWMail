const PropTypes = require('prop-types');
const React = require('react')
const { Select, Paper, MenuItem, FormControlLabel, InputLabel } = require('@material-ui/core')
const { Switch, FormControlFullWidth } = require('../../../Components/Mui')
const platformActions = require('../../../stores/platform/platformActions')
const styles = require('../settingStyles')

const LOGIN_OPEN_MODES = {
  OFF: 'false|false',
  ON: 'true|false',
  ON_BACKGROUND: 'true|true'
}

module.exports = class PlatformSettingsSection extends React.PureComponent {
  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  static propTypes = {
    mailtoLinkHandlerSupported: PropTypes.bool.isRequired,
    isMailtoLinkHandler: PropTypes.bool.isRequired,
    openAtLoginSupported: PropTypes.bool.isRequired,
    openAtLogin: PropTypes.bool.isRequired,
    openAsHiddenAtLogin: PropTypes.bool.isRequired
  };

  /* **************************************************************************/
  // UI Events
  /* **************************************************************************/

  /**
  * Handles the open at login state chaning
  */
  handleOpenAtLoginChanged = (event) => {
    switch (event.target.value) {
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
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
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
      <Paper style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Platform</h1>
        {mailtoLinkHandlerSupported ? (
          <FormControlLabel
            control={
              <Switch
                checked={isMailtoLinkHandler}
                onChange={(evt, toggled) => platformActions.changeMailtoLinkHandler(toggled)}/>
            }
            label='Handle mailto links'
          />
        ) : undefined}
        {openAtLoginSupported ? (
          <FormControlFullWidth>
            <InputLabel shrink htmlFor="open-at-login">Open at Login</InputLabel>
            <Select
              style={{width: '100%'}}
              inputProps={{
                id: 'open-at-login',
              }}
              onChange={this.handleOpenAtLoginChanged}
              value={`${openAtLogin}|${openAsHiddenAtLogin}`}
            >
              <MenuItem value={LOGIN_OPEN_MODES.OFF}>{'Don\'t open at login'}</MenuItem>
              <MenuItem value={LOGIN_OPEN_MODES.ON}>Open at login</MenuItem>
              <MenuItem value={LOGIN_OPEN_MODES.ON_BACKGROUND}>Open at login (in background)</MenuItem>
            </Select>
          </FormControlFullWidth>
        ) : undefined}
      </Paper>
    )
  }
}
