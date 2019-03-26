const React = require('react')
const { appWizardActions } = require('../../stores/appWizard')
const { platformActions } = require('../../stores/platform')
const shallowCompare = require('react-addons-shallow-compare')
const { Dialog, Button } = require('@material-ui/core')

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AppWizardMailto',
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
          label='Cancel'
          style={{ float: 'left' }}
          onClick={() => appWizardActions.cancelWizard()} />
        <Button
          variant='contained'
          label='Later'
          onClick={() => appWizardActions.progressNextStep()} />
        <Button
          variant='contained'
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
})
