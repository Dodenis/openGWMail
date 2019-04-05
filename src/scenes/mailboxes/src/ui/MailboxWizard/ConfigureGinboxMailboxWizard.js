const PropTypes = require('prop-types');
const React = require('react')
const { Button, Paper } = require('@material-ui/core')
const { Configurations } = require('../../stores/mailboxWizard')
const { Mailbox } = require('shared/Models/Mailbox')
const Colors = require('@material-ui/core/colors')

const styles = {
  introduction: {
    textAlign: 'center',
    padding: 12,
    fontSize: '110%',
    fontWeight: 'bold'
  },
  configurations: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  configuration: {
    padding: 8,
    margin: 8,
    textAlign: 'center',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    flexBasis: '50%',
    justifyContent: 'space-between',
    cursor: 'pointer'
  },
  configurationButton: {
    display: 'block',
    margin: 12
  },
  configurationImage: {
    height: 150,
    marginTop: 8,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  },
  configurationTechInfo: {
    color: Colors.grey,
    fontSize: '85%'
  }
}

module.exports = class ConfigureGinboxMailboxWizard extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    onPickedConfiguration: PropTypes.func.isRequired
  };

  /**
  * Renders the title element
  * @return jsx
  */
  static renderTitle() {
    return (
      <div>
        Pick the way that you normally use Google Inbox to configure openGWMail
        notifications and unread counters
      </div>
    )
  }

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { onPickedConfiguration } = this.props

    return (
      <div>
        <div style={styles.configurations}>
          <Paper
            style={styles.configuration}
            onClick={() => onPickedConfiguration(Configurations[Mailbox.TYPE_GINBOX].DEFAULT_INBOX)}>
            <div>
              <Button
                variant='contained'
                color="primary"
                style={styles.configurationButton}
              >
                Unread Bundled Messages (Default)
              </Button>
              <div style={Object.assign({
                backgroundImage: `url("../../images/ginbox_mode_unreadunbundled.png")`
              }, styles.configurationImage)} />
              <p>
                I'm only interested in messages in my inbox that aren't in bundles.
                This is default behaviour also seen in the iOS and Android Inbox Apps
              </p>
              <p style={styles.configurationTechInfo}>
                Unread Unbundled Messages in Inbox
              </p>
            </div>
          </Paper>
          <Paper
            style={styles.configuration}
            onClick={() => onPickedConfiguration(Configurations[Mailbox.TYPE_GINBOX].UNREAD_INBOX)}>
            <div>
              <Button
                variant='contained'
                color="primary"
                style={styles.configurationButton}
              >
                All Unread Messages
              </Button>
              <div style={Object.assign({
                backgroundImage: `url("../../images/ginbox_mode_inbox.png")`
              }, styles.configurationImage)} />
              <p>
                I'm interested in all unread messages in my inbox
              </p>
              <p style={styles.configurationTechInfo}>
                Unread Messages in Inbox
              </p>
            </div>
          </Paper>
        </div>
      </div>
    )
  }
}
