const PropTypes = require('prop-types');
const React = require('react')
const { appWizardActions } = require('../../stores/appWizard')
const { settingsStore } = require('../../stores/settings')
const { Dialog, RaisedButton } = require('material-ui')
const { TrayIconEditor } = require('../../Components')

module.exports = class AppWizardTray extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    isOpen: PropTypes.bool.isRequired
  };

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  state = {
    tray: settingsStore.getState().tray
  };

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount() {
    settingsStore.listen(this.settingsUpdated)
  }

  componentWillUnmount() {
    settingsStore.unlisten(this.settingsUpdated)
  }

  settingsUpdated = (settingsState) => {
    this.setState({ tray: settingsState.tray })
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { isOpen } = this.props
    const { tray } = this.state

    const actions = (
      <div>
        <RaisedButton
          label='Cancel'
          style={{ float: 'left' }}
          onClick={() => appWizardActions.cancelWizard()} />
        <RaisedButton
          label='Next'
          primary
          onClick={() => appWizardActions.progressNextStep()} />
      </div>
    )

    return (
      <Dialog
        modal={false}
        title='Tray Icon'
        actions={actions}
        open={isOpen}
        autoScrollBodyContent
        onRequestClose={() => appWizardActions.cancelWizard()}>
        <p style={{ textAlign: 'center' }}>
          Customise the tray icon so that it fits in with the other icons in
          your taskbar. You can change the way the icon appears when you have unread
          mail and when you have no unread mail
        </p>
        <TrayIconEditor
          tray={tray}
          style={{ textAlign: 'center' }}
          trayPreviewStyles={{ margin: '0px auto' }} />
      </Dialog>
    )
  }
}
