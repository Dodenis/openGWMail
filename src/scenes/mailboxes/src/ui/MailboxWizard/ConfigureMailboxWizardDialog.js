const React = require('react')
const { Dialog, Button, DialogContent, DialogActions, DialogTitle } = require('@material-ui/core')
const { mailboxWizardStore, mailboxWizardActions } = require('../../stores/mailboxWizard')
const { Mailbox } = require('shared/Models/Mailbox')

const ConfigureGinboxMailboxWizard = require('./ConfigureGinboxMailboxWizard')
const ConfigureGmailMailboxWizard = require('./ConfigureGmailMailboxWizard')

module.exports = class ConfigureMailboxWizardDialog extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  constructor(props) {
    super(props);
    const wizardState = mailboxWizardStore.getState()

    this.state = {
      isOpen: wizardState.configurationOpen,
      mailboxType: wizardState.provisonaMailboxType()
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
      isOpen: wizardState.addMailboxOpen,
      mailboxType: wizardState.provisonaMailboxType()
    })
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  /**
  * @param mailboxType: the type of mailbox
  * @return the configurator class for this mailbox type or undefined
  */
  getConfiguratorClass = (mailboxType) => {
    switch (mailboxType) {
      case Mailbox.TYPE_GINBOX: return ConfigureGinboxMailboxWizard
      case Mailbox.TYPE_GMAIL: return ConfigureGmailMailboxWizard
      default: return undefined
    }
  };

  /**
  * Renders the mailbox configurator for the given type
  * @param mailboxType: the type of mailbox
  * @return jsx
  */
  renderMailboxConfigurator = (mailboxType) => {
    const Configurator = this.getConfiguratorClass(mailboxType)
    return Configurator ? (
      <Configurator
        onPickedConfiguration={(cfg) => mailboxWizardActions.configureMailbox(cfg)} />
      ) : undefined
  };

  /**
  * Renders the mailbox configurator title for the given type
  * @param mailboxType: the type of mailbox
  * @return jsx
  */
  renderMailboxConfiguratorTitle = (mailboxType) => {
    const Configurator = this.getConfiguratorClass(mailboxType)
    return Configurator && Configurator.renderTitle ? Configurator.renderTitle() : undefined
  };

  /**
  * Renders the action buttons based on if there is a configuration or not
  * @return jsx
  */
  renderActions = () => {
    return (
      <div style={{ textAlign: 'left' }}>
        <Button
          variant='contained'
          onClick={() => mailboxWizardActions.configureMailbox({})}
        >
          Skip
        </Button>
      </div>
    )
  };

  render() {
    const { isOpen, mailboxType } = this.state

    return (
      <Dialog
        open={isOpen}
        onClose={() => mailboxWizardActions.cancelAddMailbox()}
      >
        <DialogTitle style={{textAlign: 'center'}}>
          {this.renderMailboxConfiguratorTitle(mailboxType)}
        </DialogTitle>
        <DialogContent>
          {this.renderMailboxConfigurator(mailboxType)}
        </DialogContent>
        <DialogActions>
          {this.renderActions()}
        </DialogActions>
      </Dialog>
    )
  }
}
