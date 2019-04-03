const PropTypes = require('prop-types');
const React = require('react')
const {Paper, Switch, SelectField, MenuItem} = require('@material-ui/core')
const Mailbox = require('shared/Models/Mailbox/Mailbox')
const Google = require('shared/Models/Mailbox/Google')
const mailboxActions = require('../../../stores/mailbox/mailboxActions')
const styles = require('../settingStyles')
const Colors = require('@material-ui/core/colors')

module.exports = class AccountUnreadSettings extends React.PureComponent {
  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  static propTypes = {
    mailbox: PropTypes.object.isRequired
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { mailbox, ...passProps } = this.props

    return (
      <Paper zDepth={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Unread &amp; Notifications</h1>
        <Switch
          defaultChecked={mailbox.showUnreadBadge}
          label='Show unread badge'
          labelPosition='right'
          onChange={(evt, toggled) => mailboxActions.setShowUnreadBage(mailbox.id, toggled)} />
        <Switch
          defaultChecked={mailbox.unreadCountsTowardsAppUnread}
          label='Add unread messages to app unread count'
          labelPosition='right'
          onChange={(evt, toggled) => mailboxActions.setUnreadCountsTowardsAppUnread(mailbox.id, toggled)} />
        <Switch
          defaultChecked={mailbox.showNotifications}
          label='Show notifications'
          labelPosition='right'
          onChange={(evt, toggled) => mailboxActions.setShowNotifications(mailbox.id, toggled)} />
        {mailbox.type === Mailbox.TYPE_GINBOX ? (
          <SelectField
            fullWidth
            value={mailbox.google.unreadMode}
            onChange={(evt, index, unreadMode) => {
              mailboxActions.updateGoogleConfig(mailbox.id, { unreadMode: unreadMode })
            }}
            floatingLabelText='Unread Mode'>
            <MenuItem
              key={Google.UNREAD_MODES.GINBOX_DEFAULT}
              value={Google.UNREAD_MODES.GINBOX_DEFAULT}>
              All Unread Unbundled Messages
            </MenuItem>
            <MenuItem
              key={Google.UNREAD_MODES.INBOX_UNREAD}
              value={Google.UNREAD_MODES.INBOX_UNREAD}>
              All Unread Messages
            </MenuItem>
            <MenuItem
              key={Google.UNREAD_MODES.INBOX}
              value={Google.UNREAD_MODES.INBOX}>
              All Messages in inbox
            </MenuItem>
          </SelectField>
        ) : undefined}
        {mailbox.type === Mailbox.TYPE_GMAIL ? (
          <SelectField
            fullWidth
            value={mailbox.google.unreadMode}
            onChange={(evt, index, unreadMode) => {
              mailboxActions.updateGoogleConfig(mailbox.id, { unreadMode: unreadMode })
            }}
            floatingLabelText='Unread Mode'>
            <MenuItem
              key={Google.UNREAD_MODES.INBOX_UNREAD}
              value={Google.UNREAD_MODES.INBOX_UNREAD}>
              All Unread Messages
            </MenuItem>
            <MenuItem
              key={Google.UNREAD_MODES.PRIMARY_INBOX_UNREAD}
              value={Google.UNREAD_MODES.PRIMARY_INBOX_UNREAD}>
              Unread Messages in Primary Category
            </MenuItem>
            <MenuItem
              key={Google.UNREAD_MODES.INBOX_UNREAD_IMPORTANT}
              value={Google.UNREAD_MODES.INBOX_UNREAD_IMPORTANT}>
              Unread Important Messages
            </MenuItem>
            <MenuItem
              key={Google.UNREAD_MODES.INBOX}
              value={Google.UNREAD_MODES.INBOX}>
              All Messages in inbox
            </MenuItem>
          </SelectField>
        ) : undefined}
        {mailbox.type === Mailbox.TYPE_GMAIL ? (
          <div>
            <Switch
              defaultChecked={mailbox.google.takeLabelCountFromUI}
              label='Scrape unread count directly from UI'
              labelPosition='right'
              disabled={!mailbox.google.canChangeTakeLabelCountFromUI}
              onChange={(evt, toggled) => {
                mailboxActions.updateGoogleConfig(mailbox.id, { takeLabelCountFromUI: toggled })
              }} />
            <div style={{color: Colors.grey['500']}}>
              <small>This will take the unread count directly from the Gmail user interface. This can improve unread count accuracy</small>
            </div>
          </div>
        ) : undefined}
      </Paper>
    )
  }
}
