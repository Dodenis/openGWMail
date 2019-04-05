const PropTypes = require('prop-types');
const React = require('react')
const { appWizardActions } = require('../../stores/appWizard')
const { platformActions } = require('../../stores/platform')
const { Dialog, Button, DialogTitle, DialogContent, DialogActions } = require('@material-ui/core')

module.exports = class AppWizardMailto extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    isOpen: PropTypes.bool.isRequired
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { isOpen } = this.props
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
          onClick={() => appWizardActions.progressNextStep()}
        >
          Later
        </Button>
        <Button
          variant='contained'
          style={{ marginLeft: 8 }}
          color="primary"
          onClick={() => {
            platformActions.changeMailtoLinkHandler(true)
            appWizardActions.progressNextStep()
          }}
        >
          Make default mail client
        </Button>
      </div>
    )

    return (
      <Dialog
        open={isOpen}
        onClose={() => appWizardActions.cancelWizard()}>
        <DialogTitle>
          Default Mail Client
        </DialogTitle>
        <DialogContent>
          <div style={{textAlign: 'center'}}>
            <p>
              Would you like to make openGWMail your default mail client?
              <br />
              <small>You can always change this later</small>
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
