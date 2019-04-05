const React = require('react')
const { Dialog, Button, DialogContent, DialogActions } = require('@material-ui/core')
const { CheckCircle } = require('@material-ui/icons')
const Colors = require('@material-ui/core/colors')
const { mailboxWizardStore, mailboxWizardActions } = require('../../stores/mailboxWizard')
const { appWizardActions } = require('../../stores/appWizard')
const { settingsStore } = require('../../stores/settings')

const styles = {
  container: {
    textAlign: 'center'
  },
  tick: {
    fontSize: 80,
    color: Colors.green
  },
  instruction: {
    textAlign: 'center'
  }
}

module.exports = class ConfigureCompleteWizardDialog extends React.Component {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  state = {
    isOpen: mailboxWizardStore.getState().configurationCompleteOpen,
    hasSeenAppWizard: settingsStore.getState().app.hasSeenAppWizard
  };

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount() {
    mailboxWizardStore.listen(this.mailboxWizardChanged)
    settingsStore.listen(this.settingsChanged)
  }

  componentWillUnmount() {
    mailboxWizardStore.unlisten(this.mailboxWizardChanged)
    settingsStore.unlisten(this.settingsChanged)
  }

  mailboxWizardChanged = (wizardState) => {
    this.setState({ isOpen: wizardState.configurationCompleteOpen })
  };

  settingsChanged = (settingsState) => {
    this.setState({ hasSeenAppWizard: settingsStore.getState().app.hasSeenAppWizard })
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { isOpen, hasSeenAppWizard } = this.state
    const actions = (
      <Button
        variant='contained'
        color="primary"
        onClick={() => {
          mailboxWizardActions.configurationComplete()
          if (!hasSeenAppWizard) {
            setTimeout(() => {
              appWizardActions.startWizard()
            }, 500) // Feels more natural after a delay
          }
        }}
      >
        Finish
      </Button>
    )

    return (
      <Dialog
        open={isOpen}
      >
        <DialogContent>
          <div style={styles.container}>
            <CheckCircle style={styles.tick} />
            <h3>All Done!</h3>
            <p style={styles.instruction}>
              You can change your mailbox settings at any time in the settings
            </p>
          </div>
        </DialogContent>
        <DialogActions>
          {actions}
        </DialogActions>
      </Dialog>
    )
  }
}
