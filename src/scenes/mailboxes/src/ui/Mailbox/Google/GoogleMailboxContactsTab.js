const PropTypes = require('prop-types');
const React = require('react')
const MailboxTabSleepable = require('../MailboxTabSleepable')
const Mailbox = require('shared/Models/Mailbox/Mailbox')
const { settingsStore } = require('../../../stores/settings')
const {
  remote: {shell}
} = window.nativeRequire('electron')

const REF = 'mailbox_tab'

module.exports = class GoogleMailboxContactsTab extends React.Component {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    mailboxId: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    const settingsState = settingsStore.getState()

    this.state = {
      os: settingsState.os
    };
  }

  /* **************************************************************************/
  // Component lifecylce
  /* **************************************************************************/

  componentDidMount() {
    settingsStore.listen(this.settingsChanged)
  }

  componentWillUnmount() {
    settingsStore.unlisten(this.settingsChanged)
  }

  settingsChanged = (settingsState) => {
    this.setState({ os: settingsState.os })
  };

  /* **************************************************************************/
  // Browser Events
  /* **************************************************************************/

  /**
  * Opens a new url in the correct way
  * @param url: the url to open
  */
  handleOpenNewWindow = (url) => {
    shell.openExternal(url, { activate: !this.state.os.openLinksInBackground })
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { mailboxId } = this.props

    return (
      <MailboxTabSleepable
        ref={REF}
        preload='../platform/webviewInjection/googleService'
        mailboxId={mailboxId}
        service={Mailbox.SERVICES.CONTACTS}
        newWindow={(evt) => { this.handleOpenNewWindow(evt.url) }} />
    )
  }
}
