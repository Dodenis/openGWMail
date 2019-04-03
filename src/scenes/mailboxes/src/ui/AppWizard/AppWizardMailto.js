const PropTypes = require('prop-types');
const React = require('react')
const { appWizardActions } = require('../../stores/appWizard')
const { platformActions } = require('../../stores/platform')
const { Dialog, RaisedButton } = require('material-ui')

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
        <RaisedButton
          label='Cancel'
          style={{ float: 'left' }}
          onClick={() => appWizardActions.cancelWizard()} />
        <RaisedButton
          label='Later'
          onClick={() => appWizardActions.progressNextStep()} />
        <RaisedButton
          label='Make default mail client'
          style={{ marginLeft: 8 }}
          primary
          onClick={() => {
            platformActions.changeMailtoLinkHandler(true)
            appWizardActions.progressNextStep()
          }} />
      </div>
    )

    return (
      <Dialog
        modal={false}
        title='Default Mail Client'
        actions={actions}
        open={isOpen}
        autoScrollBodyContent
        onRequestClose={() => appWizardActions.cancelWizard()}>
        <div style={{textAlign: 'center'}}>
          <p>
            Would you like to make openGWMail your default mail client?
            <br />
            <small>You can always change this later</small>
          </p>
        </div>
      </Dialog>
    )
  }
}
