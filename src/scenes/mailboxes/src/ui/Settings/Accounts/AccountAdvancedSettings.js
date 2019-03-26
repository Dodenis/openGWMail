const React = require('react')
const { Paper, Switch } = require('@material-ui/core')
const mailboxActions = require('../../../stores/mailbox/mailboxActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AccountAdvancedSettings',
  propTypes: {
    mailbox: React.PropTypes.object.isRequired,
    showRestart: React.PropTypes.func.isRequired
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { mailbox, showRestart, ...passProps } = this.props

    return (
      <Paper zDepth={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Advanced</h1>
        <Switch
          checked={mailbox.artificiallyPersistCookies}
          label='Artificially Persist Cookies. Use if you are signed out every restart. (Requires Restart)'
          labelPosition='right'
          onChange={(evt, toggled) => {
            showRestart()
            mailboxActions.artificiallyPersistCookies(mailbox.id, toggled)
          }} />
      </Paper>
    )
  }
})
