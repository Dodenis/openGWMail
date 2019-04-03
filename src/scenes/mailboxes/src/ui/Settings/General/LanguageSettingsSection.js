const PropTypes = require('prop-types');
const React = require('react')
const { Switch, Paper, SelectField, MenuItem, Button, Icon } = require('@material-ui/core')
const flux = {
  settings: require('../../../stores/settings'),
  dictionaries: require('../../../stores/dictionaries')
}
const styles = require('../settingStyles')

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
      <Paper zDepth={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Language</h1>
        <Switch
          checked={language.spellcheckerEnabled}
          labelPosition='right'
          label='Spell-checker (Requires Restart)'
          onChange={(evt, toggled) => {
            showRestart()
            flux.settings.A.setEnableSpellchecker(toggled)
          }} />
        <SelectField
          floatingLabelText='Spell-checker language'
          value={language.spellcheckerLanguage}
          fullWidth
          onChange={(evt, index, value) => { flux.settings.A.setSpellcheckerLanguage(value) }}>
          {installedDictionaries.map((info) => {
            return (<MenuItem key={info.lang} value={info.lang}>{info.name}</MenuItem>)
          })}
        </SelectField>
        <SelectField
          floatingLabelText='Secondary Spell-checker language'
          value={language.secondarySpellcheckerLanguage !== null ? language.secondarySpellcheckerLanguage : '__none__'}
          fullWidth
          onChange={(evt, index, value) => {
            flux.settings.A.setSecondarySpellcheckerLanguage(value !== '__none__' ? value : null)
          }}>
          {[undefined].concat(installedDictionaries).map((info) => {
            if (info === undefined) {
              return (<MenuItem key='__none__' value='__none__'>None</MenuItem>)
            } else {
              const disabled = primaryDictionaryInfo.charset !== info.charset
              return (<MenuItem key={info.lang} value={info.lang} disabled={disabled}>{info.name}</MenuItem>)
            }
          })}
        </SelectField>
        <Button
          variant='contained'
          label='Install more Dictionaries'
          icon={<Icon className='material-icons'>language</Icon>}
          onTouchTap={() => { flux.dictionaries.A.startDictionaryInstall() }} />
      </Paper>
    )
  }
}
