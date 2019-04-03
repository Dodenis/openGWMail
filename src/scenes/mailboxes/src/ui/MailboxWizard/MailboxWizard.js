const React = require('react')
const { mailboxWizardStore } = require('../../stores/mailboxWizard')
const AddMailboxWizardDialog = require('./AddMailboxWizardDialog')
const ConfigureMailboxWizardDialog = require('./ConfigureMailboxWizardDialog')
const ConfigureMailboxServicesDialog = require('./ConfigureMailboxServicesDialog')
const ConfigureCompleteWizardDialog = require('./ConfigureCompleteWizardDialog')

module.exports = class MailboxWizard extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  constructor(props) {
    super(props);
    const itemsOpen = mailboxWizardStore.getState().hasAnyItemsOpen()

    this.state = {
      itemsOpen: itemsOpen,
      render: itemsOpen
    };
  }

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount() {
    this.renderTO = null
    mailboxWizardStore.listen(this.wizardChanged)
  }

  componentWillUnmount() {
    clearTimeout(this.renderTO)
    mailboxWizardStore.unlisten(this.wizardChanged)
  }

  wizardChanged = (wizardState) => {
    this.setState((prevState) => {
      const itemsOpen = wizardState.hasAnyItemsOpen()
      const update = { itemsOpen: itemsOpen }
      if (prevState.itemsOpen !== itemsOpen) {
        clearTimeout(this.renderTO)
        if (prevState.itemsOpen && !itemsOpen) {
          this.renderTO = setTimeout(() => {
            this.setState({ render: false })
          }, 1000)
        } else if (!prevState.itemsOpen && itemsOpen) {
          update.render = true
        }
      }
      return update
    })
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    if (this.state.render) {
      return (
        <div>
          <AddMailboxWizardDialog />
          <ConfigureMailboxWizardDialog />
          <ConfigureMailboxServicesDialog />
          <ConfigureCompleteWizardDialog />
        </div>
      )
    } else {
      return null
    }
  }
}
