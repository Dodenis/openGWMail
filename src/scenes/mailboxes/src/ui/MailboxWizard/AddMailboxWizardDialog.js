const React = require('react')
const { Dialog, Button, Avatar } = require('@material-ui/core')
const { mailboxWizardStore, mailboxWizardActions } = require('../../stores/mailboxWizard')

const styles = {
  mailboxRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  mailboxCell: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 40,
    marginRight: 40
  },
  mailboxAvatar: {
    cursor: 'pointer'
  }
}

module.exports = class AddMailboxWizardDialog extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  constructor(props) {
    super(props);
    const wizardState = mailboxWizardStore.getState()

    this.state = {
      isOpen: wizardState.addMailboxOpen
    };
  }

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount() {
    mailboxWizardStore.listen(this.wizardChanged)
  }

  componentWillUnmount() {
    mailboxWizardStore.unlisten(this.wizardChanged)
  }

  wizardChanged = (wizardState) => {
    this.setState({
      isOpen: wizardState.addMailboxOpen
    })
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { isOpen } = this.state
    const actions = (
      <Button variant='contained' label='Cancel' onClick={() => mailboxWizardActions.cancelAddMailbox()} />
    )

    return (
      <Dialog
        modal={false}
        actions={actions}
        open={isOpen}
        autoScrollBodyContent
        onRequestClose={() => mailboxWizardActions.cancelAddMailbox()}>
        <div style={styles.mailboxRow}>
          <div style={styles.mailboxCell}>
            <Avatar
              src='../../images/gmail_icon_512.png'
              size={80}
              style={styles.mailboxAvatar}
              onClick={() => mailboxWizardActions.authenticateGmailMailbox()} />
            <p>Add your Gmail account</p>
            <Button
              variant='contained'
              label='Add Gmail'
              primary
              onClick={() => mailboxWizardActions.authenticateGmailMailbox()} />
          </div>
          <div style={styles.mailboxCell}>
            <Avatar
              src='../../images/ginbox_icon_512.png'
              size={80}
              style={styles.mailboxAvatar}
              onClick={() => mailboxWizardActions.authenticateGinboxMailbox()} />
            <p>Add your Google Inbox account</p>
            <Button
              variant='contained'
              label='Add Google Inbox'
              primary
              onClick={() => mailboxWizardActions.authenticateGinboxMailbox()} />
          </div>
        </div>
      </Dialog>
    )
  }
}
