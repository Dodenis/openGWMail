const React = require('react')
const {
  Stepper, Step, StepLabel, StepContent,
  Button, LinearProgress,
  MenuItem, InputLabel, Select
} = require('@material-ui/core')
const { FormControlFullWidth } = require('../../Components/Mui')
const dictionariesStore = require('../../stores/dictionaries/dictionariesStore')
const dictionariesActions = require('../../stores/dictionaries/dictionariesActions')
const {
  remote: {shell}
} = window.nativeRequire('electron')

const STEPS = {
  PICK: 0,
  LICENSE: 1,
  DOWNLOAD: 2,
  FINISH: 3
}

module.exports = class DictionaryInstallStepper extends React.Component {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  constructor (props) {
    super(props)

    this.state = this.getInitialStoreState()
  }

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount() {
    dictionariesStore.listen(this.dictionariesChanged)
  }

  componentWillUnmount() {
    dictionariesStore.unlisten(this.dictionariesChanged)
  }

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  getInitialStoreState = () => {
    const store = dictionariesStore.getState()
    return {
      stepIndex: STEPS.PICK,
      installLanguage: store.installLanguage(),
      installLanguageInfo: null,
      installId: store.installId(),
      installInflight: store.installInflight(),
      uninstallDictionaries: store.sortedUninstalledDictionaryInfos()
    }
  };

  dictionariesChanged = (store) => {
    if (store.installId() !== this.state.installId) {
      this.setState(this.getInitialStoreState())
    } else {
      if (!this.state.installLanguage && store.installLanguage()) {
        this.setState({
          installLanguage: store.installLanguage(),
          installLanguageInfo: store.getDictionaryInfo(store.installLanguage()),
          stepIndex: STEPS.LICENSE
        })
      } else if (!this.state.installInflight && store.installInflight()) {
        this.setState({
          installInflight: store.installInflight(),
          stepIndex: STEPS.DOWNLOAD
        })
      } else if (this.state.installInflight && !store.installInflight()) {
        this.setState({
          installInflight: store.installInflight(),
          stepIndex: STEPS.FINISH
        })
      }
    }
  };

  /* **************************************************************************/
  // UI Events
  /* **************************************************************************/

  /**
  * Progress the user when they pick their language
  */
  handlePickLanguage = (event) => {
    if (event.target.value !== null) {
      dictionariesActions.pickDictionaryInstallLanguage(this.state.installId, event.target.value)
    }
  };

  /**
  * Handles the user agreeing to the license
  */
  handleAgreeLicense = () => {
    dictionariesActions.installDictionary(this.state.installId)
  };

  /**
  * Handles cancelling the install
  */
  handleCancel = () => {
    dictionariesActions.stopDictionaryInstall()
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { stepIndex, installLanguageInfo, uninstallDictionaries } = this.state

    return (
      <Stepper activeStep={stepIndex} orientation='vertical'>
        <Step>
          <StepLabel>Pick Language</StepLabel>
          <StepContent>
            <FormControlFullWidth>
              <InputLabel htmlFor="pick-the-dictionary-to-install">Pick the dictionary to install</InputLabel>
              <Select
                value=""
                style={{width: '100%'}}
                inputProps={{
                  id: 'pick-the-dictionary-to-install',
                }}
                onChange={this.handlePickLanguage}>
                {[null].concat(uninstallDictionaries).map((info) => {
                  if (info === null) {
                    return (<MenuItem key='null' value={null} />)
                  } else {
                    return (<MenuItem key={info.lang} value={info.lang}>{info.name}</MenuItem>)
                  }
                })}
              </Select>
            </FormControlFullWidth>
            <Button
              disableTouchRipple
              disableFocusRipple
              onClick={this.handleCancel}
            >
              Cancel
            </Button>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Licensing</StepLabel>
          <StepContent>
            <p>
              <span>Check you're happy with the </span>
              <a href={(installLanguageInfo || {}).license} onClick={(evt) => { evt.preventDefault(); shell.openExternal(installLanguageInfo.license) }}>license</a>
              <span> of the <strong>{(installLanguageInfo || {}).name}</strong> dictionary</span>
            </p>
            <Button
              variant='contained'
              disableTouchRipple
              disableFocusRipple
              color="primary"
              onClick={this.handleAgreeLicense}
              style={{marginRight: 12}}
            >
              Next
            </Button>
            <Button
              disableTouchRipple
              disableFocusRipple
              onClick={this.handleCancel}
            >
              Cancel
            </Button>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Download</StepLabel>
          <StepContent>
            <p>Downloading <strong>{(installLanguageInfo || {}).name}</strong></p>
            <LinearProgress mode='indeterminate' />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Finish</StepLabel>
          <StepContent>
            <p>
              <span>The </span>
              <strong>{(installLanguageInfo || {}).name}</strong>
              <span> dictionary has been downloaded and installed.</span>
            </p>
            <Button
              variant='contained'
              disableTouchRipple
              disableFocusRipple
              color="primary"
              onClick={this.handleCancel}
            >
              Done
            </Button>
          </StepContent>
        </Step>
      </Stepper>
    )
  }
}
