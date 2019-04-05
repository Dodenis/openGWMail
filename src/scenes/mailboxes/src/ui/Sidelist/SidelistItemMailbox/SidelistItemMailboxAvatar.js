const PropTypes = require('prop-types');
const React = require('react')
const { AvatarAccount } = require('../../../Components/Mui')
const { mailboxStore } = require('../../../stores/mailbox')

module.exports = class SidelistItemMailboxAvatar extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    isHovering: PropTypes.bool.isRequired,
    mailbox: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { isActive, isHovering, mailbox, index, ...passProps } = this.props

    let url
    let children
    let backgroundColor
    const borderColor = isActive || isHovering ? mailbox.color : 'white'
    if (mailbox.hasCustomAvatar) {
      url = mailboxStore.getState().getAvatar(mailbox.customAvatarId)
      backgroundColor = 'white'
    } else if (mailbox.avatarURL) {
      url = mailbox.avatarURL
      backgroundColor = 'white'
    } else {
      children = index
      backgroundColor = mailbox.color
    }

    return (
      <AvatarAccount
        {...passProps}
        src={url}
        color='white'
        style={{ borderColor: borderColor, backgroundColor: backgroundColor }}>
        {children}
      </AvatarAccount>
    )
  }
}
