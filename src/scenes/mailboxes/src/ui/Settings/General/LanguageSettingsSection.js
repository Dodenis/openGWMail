const PropTypes = require('prop-types');
const React = require('react')
const {
  Paper, MenuItem, Button, FormControlLabel, FormControl,
  InputLabel, FormGroup, Select
} = require('@material-ui/core')
const { Switch, FormControlFullWidth } = require('../../../Components/Mui')
const flux = {
  settings: require('../../../stores/settings'),
  dictionaries: require('../../../stores/dictionaries')
}
const styles = require('../settingStyles')
const { Language } = require('@material-ui/icons')

module.exports = class LanguageSettingsSection extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    language: PropTypes.object.isRequired,
    showRestart: PropTypes.func.isRequired
  };

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  state = {
    installedDictionaries: flux.dictionaries.S.getState().sortedInstalledDictionaryInfos()
  };

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount() {
    flux.dictionaries.S.listen(this.dictionariesChanged)
  }

  componentWillUnmount() {
    flux.dictionaries.S.unlisten(this.dictionariesChanged)
  }

  dictionariesChanged = (store) => {
    this.setState({
      installedDictionaries: flux.dictionaries.S.getState().sortedInstalledDictionaryInfos()
    })
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const {language, showRestart, ...passProps} = this.props
    const { installedDictionaries } = this.state
    const dictionaryState = flux.dictionaries.S.getState()
    const primaryDictionaryInfo = dictionaryState.getDictionaryInfo(language.spellcheckerLanguage)

    return (
      <Paper style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Language</h1>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={language.spellcheckerEnabled}
                onChange={(evt, toggled) => {
                  showRestart()
                  flux.settings.A.setEnableSpellchecker(toggled)
                }}/>
            }
            label='Spell-checker (Requires Restart)'
          />
          <FormControlFullWidth>
            <InputLabel shrink htmlFor="spell-checker-language">
              Spell-checker language
            </InputLabel>
            <Select
              value={language.spellcheckerLanguage}
              style={{width: '100%'}}
              inputProps={{
                id: 'spell-checker-language',
              }}
              onChange={(event) => { flux.settings.A.setSpellcheckerLanguage(event.target.value) }}>
              {installedDictionaries.map((info) => {
                return (<MenuItem key={info.lang} value={info.lang}>{info.name}</MenuItem>)
              })}
            </Select>
          </FormControlFullWidth>
          <FormControlFullWidth>
            <InputLabel shrink htmlFor="secondary-spell-checker-language">
              Secondary Spell-checker language
            </InputLabel>
            <Select
              value={language.secondarySpellcheckerLanguage !== null ? language.secondarySpellcheckerLanguage : '__none__'}
              style={{width: '100%'}}
              inputProps={{
                id: 'secondary-spell-checker-language',
              }}
              onChange={(event) => {
                flux.settings.A.setSecondarySpellcheckerLanguage(event.target.value !== '__none__' ? event.target.value : null)
              }}>
              {[undefined].concat(installedDictionaries).map((info) => {
                if (info === undefined) {
                  return (<MenuItem key='__none__' value='__none__'>None</MenuItem>)
                } else {
                  const disabled = primaryDictionaryInfo.charset !== info.charset
                  return (<MenuItem key={info.lang} value={info.lang} disabled={disabled}>{info.name}</MenuItem>)
                }
              })}
            </Select>
          </FormControlFullWidth>
          <Button
            variant='contained'
            onClick={() => { flux.dictionaries.A.startDictionaryInstall() }}
          >
            <Language />
            Install more Dictionaries
          </Button>
        </FormGroup>
      </Paper>
    )
  }
}
