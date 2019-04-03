const React = require('react')
const { Dialog } = require('material-ui')
const dictionariesStore = require('../../stores/dictionaries/dictionariesStore')
const DictionaryInstallStepper = require('./DictionaryInstallStepper')

module.exports = class DictionaryInstallHandler extends React.Component {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  constructor(props) {
    super(props);
    const store = dictionariesStore.getState()

    this.state = {
      isInstalling: store.isInstalling(),
      installId: store.installId()
    };
  }

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentWillMount() {
    dictionariesStore.listen(this.dictionariesChanged)
  }

  componentWillUnmount() {
    dictionariesStore.unlisten(this.dictionariesChanged)
  }

  dictionariesChanged = (store) => {
    this.setState({
      isInstalling: store.isInstalling(),
      installId: store.installId()
    })
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    return (
      <Dialog
        modal
        title={`Install Dictionary`}
        open={this.state.isInstalling}>
        {!this.state.isInstalling ? undefined : (
          <DictionaryInstallStepper key={this.state.installId} />
        )}
      </Dialog>
    )
  }
}
