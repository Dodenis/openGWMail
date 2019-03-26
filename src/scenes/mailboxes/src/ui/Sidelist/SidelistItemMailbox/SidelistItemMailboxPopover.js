const React = require('react')
const { Popover, Menu, MenuItem, Divider, Icon } = require('@material-ui/core')
const { mailboxDispatch, navigationDispatch } = require('../../../Dispatch')
const { mailboxActions } = require('../../../stores/mailbox')
const { mailboxWizardActions } = require('../../../stores/mailboxWizard')
const shallowCompare = require('react-addons-shallow-compare')

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SidelistItemMailboxPopover',
  propTypes: {
    mailbox: React.PropTypes.object.isRequired,
    isFirst: React.PropTypes.bool.isRequired,
    isLast: React.PropTypes.bool.isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    anchor: React.PropTypes.any,
    onRequestClose: React.PropTypes.func.isRequired
  },

  /* **************************************************************************/
  // User Interaction
  /* **************************************************************************/

  /**
  * Closes the popover
  * @param evtOrFn: the fired event or a function to call on closed
  */
  handleClosePopover (evtOrFn) {
    this.props.onRequestClose()
    if (typeof (evtOrFn) === 'function') {
      setTimeout(() => { evtOrFn() }, 200)
    }
  },

  /**
  * Deletes this mailbox
  */
  handleDelete () {
    this.handleClosePopover(() => {
      mailboxActions.remove(this.props.mailbox.id)
    })
  },

  /**
  * Opens the inspector window for this mailbox
  */
  handleInspect () {
    mailboxDispatch.openDevTools(this.props.mailbox.id)
    this.handleClosePopover()
  },

  /**
  * Reloads this mailbox
  */
  handleReload () {
    mailboxDispatch.reload(this.props.mailbox.id)
    this.handleClosePopover()
  },

  /**
  * Moves this item up
  */
  handleMoveUp () {
    this.handleClosePopover(() => {
      mailboxActions.moveUp(this.props.mailbox.id)
    })
  },

  /**
  * Moves this item down
  */
  handleMoveDown () {
    this.handleClosePopover(() => {
      mailboxActions.moveDown(this.props.mailbox.id)
    })
  },

  /**
  * Handles the user requesting an account reauthentication
  */
  handeReAuthenticate () {
    mailboxActions.reauthenticateBrowserSession(this.props.mailbox.id)
    this.handleClosePopover()
  },

  /**
  * Handles opening the account settings
  */
  handleAccountSettings () {
    this.handleClosePopover(() => {
      navigationDispatch.openMailboxSettings(this.props.mailbox.id)
    })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  /**
  * Renders the menu items
  * @param mailbox: the mailbox to render for
  * @param isFirst: true if this is the first item
  * @Param isLast: true if this is the last item
  * @return array of jsx elements
  */
  renderMenuItems (mailbox, isFirst, isLast) {
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
          leftIcon={<Icon className='material-icons' style={{ color: 'red' }}>error_outline</Icon>} >
          Reauthenticate Account
        </MenuItem>
      ) : undefined,
      mailbox.google.authHasGrantError ? (<Divider key='div-err' />) : undefined,

      // Ordering controls
      isFirst ? undefined : (
        <MenuItem
          key='moveup'
          onClick={this.handleMoveUp}
          leftIcon={<Icon className='material-icons'>arrow_upward</Icon>}>
          Move Up
        </MenuItem>),
      isLast ? undefined : (
        <MenuItem
          key='movedown'
          onClick={this.handleMoveDown}
          leftIcon={<Icon className='material-icons'>arrow_downward</Icon>}>
          Move Down
        </MenuItem>),
      isFirst && isLast ? undefined : (<Divider key='div-0' />),

      // Account Actions
      (<MenuItem
        key='delete'
        onClick={this.handleDelete}
        leftIcon={<Icon className='material-icons'>delete</Icon>}>
        Delete
      </MenuItem>),
      (<MenuItem
        key='settings'
        onClick={this.handleAccountSettings}
        leftIcon={<Icon className='material-icons'>settings</Icon>}>
        Account Settings
      </MenuItem>),
      !mailbox.artificiallyPersistCookies ? undefined : (
        <MenuItem
          key='reauthenticate'
          onClick={this.handeReAuthenticate}
          leftIcon={<Icon className='material-icons'>lock_outline</Icon>}>
          Re-Authenticate
        </MenuItem>),
      (<Divider key='div-1' />),

      // Advanced Actions
      (<MenuItem
        key='reload'
        onClick={this.handleReload}
        leftIcon={<Icon className='material-icons'>refresh</Icon>}>
        Reload
      </MenuItem>),
      (<MenuItem
        key='inspect'
        onClick={this.handleInspect}
        leftIcon={<Icon className='material-icons'>bug_report</Icon>}>
        Inspect
      </MenuItem>)
    ].filter((item) => !!item)

    return menuItems
  },

  render () {
    const { mailbox, isFirst, isLast, isOpen, anchor } = this.props

    return (
      <Popover
        open={isOpen}
        anchorEl={anchor}
        anchorOrigin={{ horizontal: 'middle', vertical: 'center' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        onRequestClose={this.handleClosePopover}>
        <Menu desktop onEscKeyDown={this.handleClosePopover}>
          {this.renderMenuItems(mailbox, isFirst, isLast)}
        </Menu>
      </Popover>
    )
  }
})
