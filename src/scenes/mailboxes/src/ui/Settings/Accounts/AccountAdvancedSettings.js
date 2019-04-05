const PropTypes = require('prop-types');
const React = require('react')
const { Paper, FormControlLabel } = require('@material-ui/core')
const Switch = require('../../../Components/Switch')
const mailboxActions = require('../../../stores/mailbox/mailboxActions')
const styles = require('../settingStyles')

module.exports = class AccountAdvancedSettings extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    mailbox: PropTypes.object.isRequired,
    showRestart: PropTypes.func.isRequired
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { mailbox, showRestart, ...passProps } = this.props

    return (
      <Paper style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Advanced</h1>
        <FormControlLabel
          control={
            <Switch
              checked={mailbox.artificiallyPersistCookies}
              onChange={(evt, toggled) => {
                showRestart()
                mailboxActions.artificiallyPersistCookies(mailbox.id, toggled)
              }}/>
          }
          label='Artificially Persist Cookies. Use if you are signed out every restart. (Requires Restart)'
        />
      </Paper>
    )
  }
}
