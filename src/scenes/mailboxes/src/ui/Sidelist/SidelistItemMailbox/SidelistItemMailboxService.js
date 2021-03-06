const PropTypes = require('prop-types');
const React = require('react')
const { Mailbox } = require('shared/Models/Mailbox')
const { AvatarService } = require('../../../Components/Mui')
const styles = require('../SidelistStyles')

module.exports = class SidelistItemMailboxServices extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    mailbox: PropTypes.object.isRequired,
    isActiveMailbox: PropTypes.bool.isRequired,
    isActiveService: PropTypes.bool.isRequired,
    onOpenService: PropTypes.func.isRequired,
    service: PropTypes.string.isRequired
  };

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  state = { isHovering: false };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  /**
  * @param mailboxType: the type of mailbox
  * @param service: the service type
  * @return the url of the service icon
  */
  getServiceIconUrl = (mailboxType, service) => {
    if (mailboxType === Mailbox.TYPE_GMAIL || mailboxType === Mailbox.TYPE_GINBOX) {
      switch (service) {
        case Mailbox.SERVICES.STORAGE: return '../../images/google_services/logo_drive_128px.png'
        case Mailbox.SERVICES.CONTACTS: return '../../images/google_services/logo_contacts_128px.png'
        case Mailbox.SERVICES.NOTES: return '../../images/google_services/logo_keep_128px.png'
        case Mailbox.SERVICES.CALENDAR: return '../../images/google_services/logo_calendar_128px.png'
        case Mailbox.SERVICES.COMMUNICATION: return '../../images/google_services/logo_hangouts_128px.png'
        case Mailbox.SERVICES.MEET: return '../../images/google_services/logo_meet_128px.png'
        case Mailbox.SERVICES.CHAT: return '../../images/google_services/logo_chat_128px.png'
        case Mailbox.SERVICES.MAPS: return '../../images/google_services/logo_maps_128px.png'
      }
    }

    return ''
  };

  render() {
    const { mailbox, isActiveMailbox, isActiveService, service, onOpenService, ...passProps } = this.props
    const { isHovering } = this.state
    const isActive = isActiveMailbox && isActiveService
    const borderColor = isActive || isHovering ? mailbox.color : 'white'

    const style = mailbox.compactServicesUI ? {} : { borderColor: borderColor, backgroundColor: 'white' }
    return (
      <AvatarService
        {...passProps}
        src={this.getServiceIconUrl(mailbox.type, service)}
        onMouseEnter={() => this.setState({ isHovering: true })}
        onMouseLeave={() => this.setState({ isHovering: false })}
        onClick={(evt) => onOpenService(evt, service)}
        active={isActive || isHovering}
        compact={mailbox.compactServicesUI}
        style={style} />
    )
  }
}
