const PropTypes = require('prop-types');
const React = require('react')
const { appWizardActions } = require('../../stores/appWizard')
const { mailboxStore } = require('../../stores/mailbox')
const { mailboxWizardActions } = require('../../stores/mailboxWizard')
const { Dialog, Button, Icon, DialogContent, DialogActions } = require('@material-ui/core')
const { CheckCircle } = require('@material-ui/icons')
const Colors = require('@material-ui/core/colors')

const styles = {
  container: {
    textAlign: 'center'
  },
  tick: {
    color: Colors.green,
    fontSize: '80px'
  }
}

module.exports = class AppWizardComplete extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    isOpen: PropTypes.bool.isRequired
  };

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  state = {
    mailboxCount: mailboxStore.getState().mailboxCount()
  };

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount() {
    mailboxStore.listen(this.mailboxesUpdated)
  }

  componentWillUnmount() {
    mailboxStore.unlisten(this.mailboxesUpdated)
  }

  mailboxesUpdated = (mailboxState) => {
    this.setState({
      mailboxCount: mailboxState.mailboxCount()
    })
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { isOpen } = this.props
    const { mailboxCount } = this.state
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
          color={mailboxCount !== 0 ? "primary" : "default"}
          onClick={() => appWizardActions.progressNextStep()}
        >
          Finish
        </Button>
        {mailboxCount === 0 ? (
          <Button
            variant='contained'
            style={{marginLeft: 8}}
            color="primary"
            onClick={() => {
              appWizardActions.progressNextStep()
              mailboxWizardActions.openAddMailbox()
            }}
          >
            Add First Mailbox
          </Button>
        ) : undefined}
      </div>
    )

    return (
      <Dialog
        open={isOpen}
        onClose={() => appWizardActions.cancelWizard()}
      >
        <DialogContent>
          <div style={styles.container}>
            <CheckCircle style={styles.tick} />
            <h3>All Done!</h3>
            <p>
              You can go to settings at any time to update your preferences
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
