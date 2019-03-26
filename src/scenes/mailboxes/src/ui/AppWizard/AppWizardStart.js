const React = require('react')
const { appWizardActions } = require('../../stores/appWizard')
const shallowCompare = require('react-addons-shallow-compare')
const { Dialog, Button, Icon, Avatar } = require('@material-ui/core')
const Colors = require('@material-ui/core/colors')

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AppWizardStart',
  propTypes: {
    isOpen: React.PropTypes.bool.isRequired
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { isOpen } = this.props
    const actions = (
      <div>
        <Button
          variant='contained'
          label='Not interested'
          style={{ float: 'left' }}
          onClick={() => appWizardActions.discardWizard()} />
        <Button
          variant='contained'
          label='Later'
          onClick={() => appWizardActions.cancelWizard()} />
        <Button
          variant='contained'
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
            color={Colors.yellow}
            backgroundColor={Colors.blueGrey}
            icon={(<Icon className='fa fa-fw fa-magic' />)}
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
})
