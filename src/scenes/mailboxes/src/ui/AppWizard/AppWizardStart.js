const PropTypes = require('prop-types');
const React = require('react')
const { appWizardActions } = require('../../stores/appWizard')
const { Dialog, RaisedButton, FontIcon, Avatar } = require('material-ui')
const Colors = require('material-ui/styles/colors')

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
        <RaisedButton
          label='Not interested'
          style={{ float: 'left' }}
          onClick={() => appWizardActions.discardWizard()} />
        <RaisedButton
          label='Later'
          onClick={() => appWizardActions.cancelWizard()} />
        <RaisedButton
          label='Setup'
          style={{ marginLeft: 8 }}
          primary
          onClick={() => appWizardActions.progressNextStep()} />
      </div>
    )

    return (
      <Dialog
        modal={false}
        actions={actions}
        open={isOpen}
        autoScrollBodyContent
        onRequestClose={() => appWizardActions.cancelWizard()}>
        <div style={{ textAlign: 'center' }}>
          <Avatar
            color={Colors.yellow600}
            backgroundColor={Colors.blueGrey900}
            icon={(<FontIcon className='fa fa-fw fa-magic' />)}
            size={80} />
          <h3>openGWMail Setup</h3>
          <p>
            Customise openGWMail to work best for you by configuring a few common settings
          </p>
          <p>
            Would you like to start openGWMail setup now?
          </p>
        </div>
      </Dialog>
    )
  }
}
