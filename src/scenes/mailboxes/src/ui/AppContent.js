import './layout.less'
import './appContent.less'

const React = require('react')
const MailboxWindows = require('./Mailbox/MailboxWindows')
const MailboxComposePicker = require('./Mailbox/MailboxComposePicker')
const Sidelist = require('./Sidelist')
const SettingsDialog = require('./Settings/SettingsDialog')
const DictionaryInstallHandler = require('./DictionaryInstaller/DictionaryInstallHandler')
const {navigationDispatch} = require('../Dispatch')
const UpdateCheckDialog = require('./UpdateCheckDialog')
const { settingsStore } = require('../stores/settings')
const MailboxWizard = require('./MailboxWizard')
const AppWizard = require('./AppWizard')

module.exports = class AppContent extends React.PureComponent {

  constructor(props) {
    super(props);
    const settingsState = settingsStore.getState()

    this.state = {
      sidebar: settingsState.ui.sidebarEnabled,
      titlebar: settingsState.ui.showTitlebar,
      settingsDialog: false,
      settingsRoute: null
    };
  }

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  componentDidMount() {
    settingsStore.listen(this.settingsDidUpdate)
    navigationDispatch.on('opensettings', this.handleOpenSettings)
  }

  componentWillUnmount() {
    settingsStore.unlisten(this.settingsDidUpdate)
    navigationDispatch.off('opensettings', this.handleOpenSettings)
  }

  settingsDidUpdate = (settingsStatee) => {
    this.setState({
      sidebar: settingsStatee.ui.sidebarEnabled,
      titlebar: settingsStatee.ui.showTitlebar
    })
  };

  /* **************************************************************************/
  // Settings Interaction
  /* **************************************************************************/

  /**
  * Opens the settings dialog
  * @param evt: the event that fired if any
  */
  handleOpenSettings = (evt) => {
    this.setState({
      settingsDialog: true,
      settingsRoute: evt && evt.route ? evt.route : null
    })
  };

  handleCloseSettings = () => {
    this.setState({ settingsDialog: false, settingsRoute: null })
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    return (
      <div>
        {!this.state.titlebar ? (<div className='titlebar' />) : undefined}
        <div className='master' style={{ display: this.state.sidebar ? 'block' : 'none' }}>
          <Sidelist />
        </div>
        <div className='detail' style={{ left: this.state.sidebar ? 70 : 0 }}>
          <MailboxWindows />
        </div>
        <SettingsDialog
          open={this.state.settingsDialog}
          onClose={this.handleCloseSettings}
          initialRoute={this.state.settingsRoute} />
        <DictionaryInstallHandler />
        <AppWizard />
        <MailboxWizard />
        <UpdateCheckDialog />
        <MailboxComposePicker />
      </div>
    )
  }
}
