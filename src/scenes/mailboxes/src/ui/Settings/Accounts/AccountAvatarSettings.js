const PropTypes = require('prop-types');
const React = require('react')
const { Paper, Button, Icon } = require('@material-ui/core')
const { ColorPickerButton } = require('../../../Components')
const mailboxActions = require('../../../stores/mailbox/mailboxActions')
const styles = require('../settingStyles')
const { InsertEmoticon, NotInterested } = require('@material-ui/icons')

module.exports = class AccountAvatarSettings extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    mailbox: PropTypes.object.isRequired
  };

  /* **************************************************************************/
  // User Interaction
  /* **************************************************************************/

  handleCustomAvatarChange = (evt) => {
    if (!evt.target.files[0]) { return }

    // Load the image
    const reader = new window.FileReader()
    reader.addEventListener('load', () => {
      // Get the image size
      const image = new window.Image()
      image.onload = () => {
        // Scale the image down
        const scale = 150 / (image.width > image.height ? image.width : image.height)
        const width = image.width * scale
        const height = image.height * scale

        // Resize the image
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0, width, height)

        // Save it to disk
        mailboxActions.setCustomAvatar(this.props.mailbox.id, canvas.toDataURL())
      }
      image.src = reader.result
    }, false)
    reader.readAsDataURL(evt.target.files[0])
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { mailbox, ...passProps } = this.props

    return (
      <Paper style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Icon</h1>
        <div style={styles.button}>
          <input
            type='file'
            accept='image/*'
            onChange={this.handleCustomAvatarChange}
            style={styles.fileInput}
            id="change-account-icon-button"
          />
          <label htmlFor="change-account-icon-button">
            <Button
              fullWidth
              variant='contained'
              component='span'
              style={styles.fileInputButton}>
              <InsertEmoticon />
              Change Account Icon
            </Button>
          </label>
        </div>
        <div style={styles.button}>
          <Button
            fullWidth
            variant='contained'
            onClick={() => mailboxActions.setCustomAvatar(mailbox.id, undefined)}>
            <NotInterested />
            Reset Account Icon
          </Button>
        </div>
        <div style={styles.button}>
          <ColorPickerButton
            label='Account Colour'
            icon={<Icon className='material-icons'>color_lens</Icon>}
            value={mailbox.color}
            onChange={(col) => mailboxActions.setColor(mailbox.id, col)} />
        </div>
      </Paper>
    )
  }
}
