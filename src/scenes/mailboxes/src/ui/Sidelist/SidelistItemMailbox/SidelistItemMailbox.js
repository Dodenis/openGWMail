const PropTypes = require('prop-types');
const React = require('react')
const { Icon } = require('@material-ui/core')
const { BadgeAvatar } = require('../../../Components/Mui')
const { navigationDispatch } = require('../../../Dispatch')
const { mailboxStore, mailboxActions } = require('../../../stores/mailbox')
const ReactTooltip = require('react-tooltip')
const styles = require('../SidelistStyles')
const SidelistItemMailboxPopover = require('./SidelistItemMailboxPopover')
const SidelistItemMailboxAvatar = require('./SidelistItemMailboxAvatar')
const SidelistItemMailboxServices = require('./SidelistItemMailboxServices')

module.exports = class SidelistItemMailbox extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    mailboxId: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    isFirst: PropTypes.bool.isRequired,
    isLast: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    const mailboxState = mailboxStore.getState()
    const mailbox = mailboxState.getMailbox(props.mailboxId)

    this.state = {
      mailbox: mailbox,
      isActive: mailboxState.activeMailboxId() === props.mailboxId,
      activeService: mailboxState.activeMailboxService(),
      popover: false,
      popoverAnchor: null,
      hovering: false
    };
  }

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  componentDidMount() {
    mailboxStore.listen(this.mailboxesChanged)
    // Adding new items can cause the popover not to come up. Rebuild the tooltip
    // after a little time. Bad but seems to fix
    setTimeout(() => ReactTooltip.rebuild(), 1000)
  }

  componentWillUnmount() {
    mailboxStore.unlisten(this.mailboxesChanged)
  }

  mailboxesChanged = (mailboxState) => {
    const mailbox = mailboxState.getMailbox(this.props.mailboxId)
    this.setState({
      mailbox: mailbox,
      isActive: mailboxState.activeMailboxId() === this.props.mailboxId,
      activeService: mailboxState.activeMailboxService()
    })
  };

  /* **************************************************************************/
  // User Interaction
  /* **************************************************************************/

  /**
  * Handles the item being clicked on
  * @param evt: the event that fired
  */
  handleClick = (evt) => {
    evt.preventDefault()
    if (evt.metaKey) {
      navigationDispatch.openMailboxSettings(this.props.mailboxId)
    } else {
      mailboxActions.changeActive(this.props.mailboxId)
    }
  };

  /**
  * Handles opening a service
  * @param evt: the event that fired
  * @param service: the service to open
  */
  handleOpenService = (evt, service) => {
    evt.preventDefault()
    mailboxActions.changeActive(this.props.mailboxId, service)
  };

  /**
  * Opens the popover
  */
  handleOpenPopover = (evt) => {
    evt.preventDefault()
    this.setState({ popover: true, popoverAnchor: evt.currentTarget })
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  /**
  * Renders the badge element
  * @param mailbox: the mailbox to render for
  * @return jsx
  */
  renderBadge = (mailbox) => {
    const { isActive, hovering } = this.state
    const { index } = this.props

    let badgeContent = ""
    if (mailbox.google.authHasGrantError) {
      badgeContent = (<Icon className='fa fa-exclamation' style={{ color: 'white', fontSize: 16 }} />)
    } else if (mailbox.showUnreadBadge && mailbox.unread) {
      badgeContent = mailbox.unread >= 1000 ? Math.floor(mailbox.unread / 1000) + 'K+' : mailbox.unread
    }

    return (
      <BadgeAvatar
        onContextMenu={this.handleOpenPopover}
        onClick={this.handleClick}
        badgeContent={badgeContent}
        color="secondary" >
        <SidelistItemMailboxAvatar
          onContextMenu={this.handleOpenPopover}
          isActive={isActive}
          isHovering={hovering}
          mailbox={mailbox}
          index={index}
          onClick={this.handleClick} />
      </BadgeAvatar>
    )
  };

  /**
  * Renders the active indicator
  * @param mailbox: the mailbox to render for
  * @param isActive: true if the mailbox is active
  * @return jsx
  */
  renderActiveIndicator = (mailbox, isActive) => {
    if (isActive) {
      return (
        <div
          onClick={this.handleClick}
          style={Object.assign({ backgroundColor: mailbox.color }, styles.mailboxActiveIndicator)} />
      )
    } else {
      return undefined
    }
  };

  /**
  * Renders the content for the tooltip
  * @param mailbox: the mailbox to render for
  * @return jsx
  */
  renderTooltipContent = (mailbox) => {
    if (!mailbox.email && !mailbox.unread) { return undefined }
    const hr = '<hr style="height: 1px; border: 0; background-image: linear-gradient(to right, #bcbcbc, #fff, #bcbcbc);" />'
    const hasError = mailbox.google.authHasGrantError
    return `
      <div style="text-align:left;">
        ${mailbox.email || ''}
        ${mailbox.email && mailbox.unread ? hr : ''}
        ${mailbox.unread ? `<small>${mailbox.unread} unread message${mailbox.unread > 1 ? 's' : ''}</small>` : ''}
        ${hasError ? hr : ''}
        ${hasError ? '<span style="color:red;">Authentication Error. Right click to reauthenticate</span>' : ''}
      </div>
    `
  };

  render() {
    if (!this.state.mailbox) { return null }
    const { mailbox, isActive, activeService, popover, popoverAnchor, hovering } = this.state
    const { index, isFirst, isLast, style, ...passProps } = this.props
    delete passProps.mailboxId

    return (
      <div
        {...passProps}
        style={Object.assign({}, styles.itemContainer, styles.mailboxItemContainer, style)}
        onMouseEnter={() => this.setState({ hovering: true })}
        onMouseLeave={() => this.setState({ hovering: false })}
        data-tip={this.renderTooltipContent(mailbox)}
        data-for={`ReactComponent-Sidelist-Item-Mailbox-${mailbox.id}`}
        data-html>
        <ReactTooltip
          id={`ReactComponent-Sidelist-Item-Mailbox-${mailbox.id}`}
          place='right'
          type='dark'
          effect='solid' />
        {this.renderBadge(mailbox)}
        <SidelistItemMailboxServices
          onContextMenu={this.handleOpenPopover}
          mailbox={mailbox}
          isActiveMailbox={isActive}
          activeService={activeService}
          onOpenService={this.handleOpenService} />
        {this.renderActiveIndicator(mailbox, isActive)}
        <SidelistItemMailboxPopover
          mailbox={mailbox}
          isFirst={isFirst}
          isLast={isLast}
          isOpen={popover}
          anchor={popoverAnchor}
          onClose={() => this.setState({ popover: false })} />
      </div>
    )
  }
}
