const PropTypes = require('prop-types');
const React = require('react')
const { appWizardActions } = require('../../stores/appWizard')
const { Dialog, Button, Icon, Avatar, DialogActions, DialogContent } = require('@material-ui/core')
const { FlashOn } = require('@material-ui/icons')
const Colors = require('@material-ui/core/colors')

module.exports = class AppWizardStart extends React.PureComponent {
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
          onClick={() => appWizardActions.discardWizard()}
        >
          Not interested
        </Button>
        <Button
          variant='contained'
          onClick={() => appWizardActions.cancelWizard()}
        >
          Later
        </Button>
        <Button
          variant='contained'
          style={{ marginLeft: 8 }}
          color="primary"
          onClick={() => appWizardActions.progressNextStep()}
        >
          Setup
        </Button>
      </div>
    )

    return (
      <Dialog
        open={isOpen}
        onClose={() => appWizardActions.cancelWizard()}
      >
        <DialogContent>
          <div style={{ textAlign: 'center' }}>
            <Avatar
              style={{backgroundColor: Colors.blueGrey, color: Colors.yellow}}
              size={80}
            >
              <FlashOn />
            </Avatar>
            <h3>openGWMail Setup</h3>
            <p>
              Customise openGWMail to work best for you by configuring a few common settings
            </p>
            <p>
              Would you like to start openGWMail setup now?
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
