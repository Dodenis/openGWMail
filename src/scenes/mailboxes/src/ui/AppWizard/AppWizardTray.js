const PropTypes = require('prop-types');
const React = require('react')
const { appWizardActions } = require('../../stores/appWizard')
const { settingsStore } = require('../../stores/settings')
const { Dialog, Button, DialogTitle, DialogContent, DialogActions } = require('@material-ui/core')
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
        <Button
          variant='contained'
          style={{ float: 'left' }}
          onClick={() => appWizardActions.cancelWizard()}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          primary
          onClick={() => appWizardActions.progressNextStep()}
        >
          Next
        </Button>
      </div>
    )

    return (
      <Dialog
        open={isOpen}
        onClose={() => appWizardActions.cancelWizard()}
      >
        <DialogTitle>
          Tray Icon
        </DialogTitle>
        <DialogContent>
          <p style={{ textAlign: 'center' }}>
            Customise the tray icon so that it fits in with the other icons in
            your taskbar. You can change the way the icon appears when you have unread
            mail and when you have no unread mail
          </p>
          <TrayIconEditor
            tray={tray}
            style={{ textAlign: 'center' }}
            trayPreviewStyles={{ margin: '0px auto' }} />
        </DialogContent>
        <DialogActions>
          {actions}
        </DialogActions>
      </Dialog>
    )
  }
}
