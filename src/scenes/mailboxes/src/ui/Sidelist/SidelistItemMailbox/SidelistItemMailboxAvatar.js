const PropTypes = require('prop-types');
const React = require('react')
const { Avatar } = require('material-ui')
const { mailboxStore } = require('../../../stores/mailbox')
const styles = require('../SidelistStyles')

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
      <Avatar
        {...passProps}
        src={url}
        size={50}
        backgroundColor={backgroundColor}
        color='white'
        draggable={false}
        style={Object.assign({ borderColor: borderColor }, styles.mailboxAvatar)}>
        {children}
      </Avatar>
    )
  }
}
