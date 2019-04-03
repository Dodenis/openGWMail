const React = require('react')
const { appWizardStore } = require('../../stores/appWizard')
const AppWizardStart = require('./AppWizardStart')
const AppWizardComplete = require('./AppWizardComplete')
const AppWizardMailto = require('./AppWizardMailto')
const AppWizardTray = require('./AppWizardTray')

module.exports = class AppWizard extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  constructor(props) {
    super(props);
    const wizardState = appWizardStore.getState()
    const itemsOpen = wizardState.hasAnyItemsOpen()

    this.state = {
      itemsOpen: itemsOpen,
      render: itemsOpen,
      trayConfiguratorOpen: wizardState.trayConfiguratorOpen,
      mailtoHandlerOpen: wizardState.mailtoHandlerOpen,
      completeOpen: wizardState.completeOpen,
      startOpen: wizardState.startOpen
    };
  }

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount() {
    this.renderTO = null
    appWizardStore.listen(this.wizardChanged)
  }

  componentWillUnmount() {
    clearTimeout(this.renderTO)
    appWizardStore.unlisten(this.wizardChanged)
  }

  wizardChanged = (wizardState) => {
    this.setState((prevState) => {
      const itemsOpen = wizardState.hasAnyItemsOpen()
      const update = {
        itemsOpen: itemsOpen,
        trayConfiguratorOpen: wizardState.trayConfiguratorOpen,
        mailtoHandlerOpen: wizardState.mailtoHandlerOpen,
        completeOpen: wizardState.completeOpen,
        startOpen: wizardState.startOpen
      }

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
    const { render, startOpen, trayConfiguratorOpen, mailtoHandlerOpen, completeOpen } = this.state
    if (render) {
      return (
        <div>
          <AppWizardStart isOpen={startOpen} />
          <AppWizardTray isOpen={trayConfiguratorOpen} />
          <AppWizardMailto isOpen={mailtoHandlerOpen} />
          <AppWizardComplete isOpen={completeOpen} />
        </div>
      )
    } else {
      return null
    }
  }
}
