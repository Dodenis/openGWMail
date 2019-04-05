const PropTypes = require('prop-types');
const React = require('react')
const { Menu, MenuItem, Divider, ListItemIcon, ListItemText } = require('@material-ui/core')
const { ErrorOutline, ArrowUpward, ArrowDownward, Delete, Settings, LockOutlined, Refresh, BugReport } = require('@material-ui/icons')
const { mailboxDispatch, navigationDispatch } = require('../../../Dispatch')
const { mailboxActions } = require('../../../stores/mailbox')
const { mailboxWizardActions } = require('../../../stores/mailboxWizard')

module.exports = class SidelistItemMailboxPopover extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    mailbox: PropTypes.object.isRequired,
    isFirst: PropTypes.bool.isRequired,
    isLast: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    anchor: PropTypes.any,
    onClose: PropTypes.func.isRequired
  };

  /* **************************************************************************/
  // User Interaction
  /* **************************************************************************/

  /**
  * Closes the popover
  * @param evtOrFn: the fired event or a function to call on closed
  */
  handleClosePopover = (evtOrFn) => {
    this.props.onClose()
    if (typeof (evtOrFn) === 'function') {
      setTimeout(() => { evtOrFn() }, 200)
    }
  };

  /**
  * Deletes this mailbox
  */
  handleDelete = () => {
    this.handleClosePopover(() => {
      mailboxActions.remove(this.props.mailbox.id)
    })
  };

  /**
  * Opens the inspector window for this mailbox
  */
  handleInspect = () => {
    mailboxDispatch.openDevTools(this.props.mailbox.id)
    this.handleClosePopover()
  };

  /**
  * Reloads this mailbox
  */
  handleReload = () => {
    mailboxDispatch.reload(this.props.mailbox.id)
    this.handleClosePopover()
  };

  /**
  * Moves this item up
  */
  handleMoveUp = () => {
    this.handleClosePopover(() => {
      mailboxActions.moveUp(this.props.mailbox.id)
    })
  };

  /**
  * Moves this item down
  */
  handleMoveDown = () => {
    this.handleClosePopover(() => {
      mailboxActions.moveDown(this.props.mailbox.id)
    })
  };

  /**
  * Handles the user requesting an account reauthentication
  */
  handeReAuthenticate = () => {
    mailboxActions.reauthenticateBrowserSession(this.props.mailbox.id)
    this.handleClosePopover()
  };

  /**
  * Handles opening the account settings
  */
  handleAccountSettings = () => {
    this.handleClosePopover(() => {
      navigationDispatch.openMailboxSettings(this.props.mailbox.id)
    })
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  /**
  * Renders the menu items
  * @param mailbox: the mailbox to render for
  * @param isFirst: true if this is the first item
  * @Param isLast: true if this is the last item
  * @return array of jsx elements
  */
  renderMenuItems = (mailbox, isFirst, isLast) => {
    const menuItems = [
      // Mailbox Info
      mailbox.email ? (
        <MenuItem
          key='info'
          disabled >
          {mailbox.email}
        </MenuItem>) : undefined,

      mailbox.google.authHasGrantError ? (
        <MenuItem
          key='autherr'
          style={{ color: 'red' }}
          onClick={() => {
            mailboxWizardActions.reauthenticateGoogleMailbox(mailbox.id)
            this.handleClosePopover()
          }}
        >
          <ListItemIcon style={{ color: 'red' }}>
            <ErrorOutline />
          </ListItemIcon>
          <ListItemText style={{ color: 'red' }}>
            Reauthenticate Account
          </ListItemText>
        </MenuItem>
      ) : undefined,
      mailbox.google.authHasGrantError ? (<Divider key='div-err' />) : undefined,

      // Ordering controls
      isFirst ? undefined : (
        <MenuItem
          key='moveup'
          onClick={this.handleMoveUp}
        >
          <ListItemIcon>
            <ArrowUpward />
          </ListItemIcon>
          <ListItemText>
            Move Up
          </ListItemText>
        </MenuItem>),
      isLast ? undefined : (
        <MenuItem
          key='movedown'
          onClick={this.handleMoveDown}
        >
          <ListItemIcon>
            <ArrowDownward />
          </ListItemIcon>
          <ListItemText>
            Move Down
          </ListItemText>
        </MenuItem>),
      isFirst && isLast ? undefined : (<Divider key='div-0' />),

      // Account Actions
      (<MenuItem
        key='delete'
        onClick={this.handleDelete}
      >
        <ListItemIcon>
          <Delete />
        </ListItemIcon>
        <ListItemText>
          Delete
        </ListItemText>
      </MenuItem>),
      (<MenuItem
        key='settings'
        onClick={this.handleAccountSettings}
      >
        <ListItemIcon>
          <Settings />
        </ListItemIcon>
        <ListItemText>
          Account Settings
        </ListItemText>
      </MenuItem>),
      !mailbox.artificiallyPersistCookies ? undefined : (
        <MenuItem
          key='reauthenticate'
          onClick={this.handeReAuthenticate}
        >
          <ListItemIcon>
            <LockOutlined />
          </ListItemIcon>
          <ListItemText>
            Re-Authenticate
          </ListItemText>
        </MenuItem>),
      (<Divider key='div-1' />),

      // Advanced Actions
      (<MenuItem
        key='reload'
        onClick={this.handleReload}
      >
        <ListItemIcon>
          <Refresh />
        </ListItemIcon>
        <ListItemText>
          Reload
        </ListItemText>
      </MenuItem>),
      (<MenuItem
        key='inspect'
        onClick={this.handleInspect}
      >
        <ListItemIcon>
          <BugReport />
        </ListItemIcon>
        <ListItemText>
          Inspect
        </ListItemText>
      </MenuItem>)
    ].filter((item) => !!item)

    return menuItems
  };

  render() {
    const { mailbox, isFirst, isLast, isOpen, anchor } = this.props

    return (
      <Menu
          open={isOpen}
          anchorEl={anchor}
          onClose={this.handleClosePopover}>
          {this.renderMenuItems(mailbox, isFirst, isLast)}
      </Menu>
    )
  }
}
