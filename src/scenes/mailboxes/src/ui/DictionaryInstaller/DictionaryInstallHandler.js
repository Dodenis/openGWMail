const React = require('react')
const { Dialog, DialogTitle, DialogContent } = require('@material-ui/core')
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
        open={this.state.isInstalling}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          {`Install Dictionary`}
        </DialogTitle>
        <DialogContent>
          {!this.state.isInstalling ? (<div />) : (
            <DictionaryInstallStepper key={this.state.installId} />
          )}
        </DialogContent>
      </Dialog>
    )
  }
}
