const React = require('react')
const { Dialog, Button, List, ListItem, Avatar } = require('@material-ui/core')
const { composeStore, composeActions } = require('../../stores/compose')
const { mailboxStore, mailboxActions } = require('../../stores/mailbox')

module.exports = class MailboxComposePicker extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  constructor(props) {
    super(props);
    const mailboxState = mailboxStore.getState()
    const composeState = composeStore.getState()

    this.state = {
      mailboxes: mailboxState.allMailboxes(),
      composing: composeState.composing
    };
  }

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount() {
    composeStore.listen(this.composeChanged)
    mailboxStore.listen(this.mailboxChanged)
  }

  componentWillUnmount() {
    composeStore.unlisten(this.composeChanged)
    mailboxStore.unlisten(this.mailboxChanged)
  }

  composeChanged = (composeState) => {
    this.setState({ composing: composeState.composing })
  };

  mailboxChanged = (mailboxesState) => {
    this.setState({ mailboxes: mailboxesState.allMailboxes() })
  };

  /* **************************************************************************/
  // Data utils
  /* **************************************************************************/

  /**
  * Decides if the dialog is open or not
  * @param state=this.state: the state to calc from
  * @return true if the dialog should be open, false otherwise
  */
  isOpen = (state = this.state) => {
    return state.composing && state.mailboxes.length > 1
  };

  /* **************************************************************************/
  // UI Events
  /* **************************************************************************/

  /**
  * Dismisses the compose actions
  * @param evt: the event that fired
  */
  handleCancel = (evt) => {
    composeActions.clearCompose()
  };

  /**
  * Handles selecting the target mailbox
  * @param evt: the event that fired
  * @param mailboxId: the id of the mailbox
  */
  handleSelectMailbox = (evt, mailboxId) => {
    mailboxActions.changeActive(mailboxId)
    composeActions.setTargetMailbox(mailboxId)
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { mailboxes } = this.state
    const mailboxState = mailboxStore.getState()
    const actions = (
      <Button variant='contained' label='Cancel' onClick={this.handleCancel} />
    )

    return (
      <Dialog
        modal={false}
        title='Compose New Message'
        titleStyle={{ lineHeight: '22px' }}
        actions={actions}
        open={this.isOpen()}
        contentStyle={{ maxWidth: 'none', width: 300 }}
        bodyStyle={{ padding: 0 }}
        autoScrollBodyContent
        onRequestClose={this.handleCancel}>
        <List>
          {mailboxes.map((mailbox) => {
            let avatarSrc = ''
            if (mailbox.hasCustomAvatar) {
              avatarSrc = mailboxState.getAvatar(mailbox.customAvatarId)
            } else if (mailbox.avatarURL) {
              avatarSrc = mailbox.avatarURL
            }

            return (
              <ListItem
                leftAvatar={<Avatar src={avatarSrc} backgroundColor='white' />}
                primaryText={(mailbox.email || mailbox.name || mailbox.id)}
                onClick={(evt) => this.handleSelectMailbox(evt, mailbox.id)}
                key={mailbox.id} />)
          })}
        </List>
      </Dialog>
    )
  }
}
