const PropTypes = require('prop-types');
const React = require('react')
const { appWizardActions } = require('../../stores/appWizard')
const { mailboxStore } = require('../../stores/mailbox')
const { mailboxWizardActions } = require('../../stores/mailboxWizard')
const { Dialog, RaisedButton, FontIcon } = require('material-ui')
const Colors = require('material-ui/styles/colors')

const styles = {
  container: {
    textAlign: 'center'
  },
  tick: {
    color: Colors.green600,
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
        <RaisedButton
          label='Cancel'
          style={{ float: 'left' }}
          onClick={() => appWizardActions.cancelWizard()} />
        <RaisedButton
          label='Finish'
          primary={mailboxCount !== 0}
          onClick={() => appWizardActions.progressNextStep()} />
        {mailboxCount === 0 ? (
          <RaisedButton
            label='Add First Mailbox'
            style={{marginLeft: 8}}
            primary
            onClick={() => {
              appWizardActions.progressNextStep()
              mailboxWizardActions.openAddMailbox()
            }} />
        ) : undefined}
      </div>
    )

    return (
      <Dialog
        modal={false}
        actions={actions}
        open={isOpen}
        autoScrollBodyContent
        onRequestClose={() => appWizardActions.cancelWizard()}>
        <div style={styles.container}>
          <FontIcon className='material-icons' style={styles.tick}>check_circle</FontIcon>
          <h3>All Done!</h3>
          <p>
            You can go to settings at any time to update your preferences
          </p>
        </div>
      </Dialog>
    )
  }
}
