const PropTypes = require('prop-types');
const React = require('react')
const styles = require('../SidelistStyles')
const SidelistItemMailboxService = require('./SidelistItemMailboxService')

module.exports = class SidelistItemMailboxServices extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    mailbox: PropTypes.object.isRequired,
    isActiveMailbox: PropTypes.bool.isRequired,
    activeService: PropTypes.string.isRequired,
    onOpenService: PropTypes.func.isRequired
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { mailbox, isActiveMailbox, activeService, onOpenService, onContextMenu } = this.props
    if (!mailbox.hasEnabledServices) { return null }

    return (
      <div style={mailbox.compactServicesUI ? styles.mailboxServiceIconsCompact : styles.mailboxServiceIconsFull}>
        {mailbox.enabledServies.map((service) => {
          return (
            <SidelistItemMailboxService
              key={service}
              onContextMenu={onContextMenu}
              mailbox={mailbox}
              isActiveMailbox={isActiveMailbox}
              isActiveService={activeService === service}
              onOpenService={onOpenService}
              service={service} />
          )
        })}
      </div>
    )
  }
}
