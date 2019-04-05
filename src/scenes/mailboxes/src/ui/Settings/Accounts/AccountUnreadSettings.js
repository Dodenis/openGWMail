const PropTypes = require('prop-types');
const React = require('react')
const { Select, Paper, MenuItem, FormControlLabel, FormControl, InputLabel, FormGroup } = require('@material-ui/core')
const { Switch, FormControlFullWidth } = require('../../../Components/Mui')
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
      <Paper style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Unread &amp; Notifications</h1>
        <FormGroup>
        <FormControlLabel
          control={
            <Switch
              defaultChecked={mailbox.showUnreadBadge}
              onChange={(evt, toggled) => mailboxActions.setShowUnreadBage(mailbox.id, toggled)}/>
          }
          label='Show unread badge'
        />
        <FormControlLabel
          control={
            <Switch
              defaultChecked={mailbox.unreadCountsTowardsAppUnread}
              onChange={(evt, toggled) => mailboxActions.setUnreadCountsTowardsAppUnread(mailbox.id, toggled)} />
          }
          label='Add unread messages to app unread count'
        />
        <FormControlLabel
          control={
            <Switch
              defaultChecked={mailbox.showNotifications}
              onChange={(evt, toggled) => mailboxActions.setShowNotifications(mailbox.id, toggled)}/>
          }
          label='Show notifications'
        />
        </FormGroup>
        {mailbox.type === Mailbox.TYPE_GINBOX ? (
          <FormControlFullWidth>
            <InputLabel shrink htmlFor="unread-mode">Unread Mode</InputLabel>
            <Select
              style={{width: '100%'}}
              inputProps={{
                id: 'unread-mode',
              }}
              value={mailbox.google.unreadMode}
              onChange={(event) => {
                mailboxActions.updateGoogleConfig(mailbox.id, { unreadMode: event.target.value })
              }}>
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
            </Select>
          </FormControlFullWidth>
        ) : undefined}
        {mailbox.type === Mailbox.TYPE_GMAIL ? (
          <FormControlFullWidth>
            <InputLabel shrink htmlFor="unread-mode">Unread Mode</InputLabel>
            <Select
              style={{width: '100%'}}
              inputProps={{
                id: 'unread-mode',
              }}
              value={mailbox.google.unreadMode}
              onChange={(event) => {
                mailboxActions.updateGoogleConfig(mailbox.id, { unreadMode: event.target.value })
              }}>
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
            </Select>
          </FormControlFullWidth>
        ) : undefined}
        {mailbox.type === Mailbox.TYPE_GMAIL ? (
          <div>
            <FormControlLabel
              control={
                <Switch
                  defaultChecked={mailbox.google.takeLabelCountFromUI}
                  disabled={!mailbox.google.canChangeTakeLabelCountFromUI}
                  onChange={(evt, toggled) => {
                    mailboxActions.updateGoogleConfig(mailbox.id, { takeLabelCountFromUI: toggled })
                  }}/>
              }
              label='Scrape unread count directly from UI'
            />
            <div style={{color: Colors.grey['500']}}>
              <small>This will take the unread count directly from the Gmail user interface. This can improve unread count accuracy</small>
            </div>
          </div>
        ) : undefined}
      </Paper>
    )
  }
}
