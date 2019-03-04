const { webFrame, ipcRenderer } = require('electron')
const DictionaryLoad = require('./DictionaryLoad')
const dictionaryExcludes = require('../../../../app/shared/dictionaryExcludes')
const elconsole = require('../elconsole')

const { SpellCheckerProvider } = require('../../../../app/node_modules/electron-hunspell')

class Spellchecker {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    this._spellcheckers_ = {
      provider: new SpellCheckerProvider(),
      primary: null,
      secondary: null
    }
    this._spellcheckers_.provider.initialize()

    ipcRenderer.on('start-spellcheck', (evt, data) => {
      this.updateSpellchecker(data.language, data.secondaryLanguage)
    })
  }

  /* **************************************************************************/
  // Properties
  /* **************************************************************************/

  get hasPrimarySpellchecker () { return this._spellcheckers_.primary !== null }
  get hasSecondarySpellchecker () { return this._spellcheckers_.secondary !== null }
  get hasSpellchecker () { return this.hasPrimarySpellchecker || this.hasSecondarySpellchecker }

  /* **************************************************************************/
  // Checking & Suggestions
  /* **************************************************************************/

  /**
  * Checks if a word is spelt correctly in one spellchecker
  * @param spellchecker: the reference to the spellchecker
  * @param text: the word to check
  * @return true if the work is correct
  */
  checkSpellcheckerWord (spellchecker, text) {
    if (spellchecker) {
      if (dictionaryExcludes[spellchecker] && dictionaryExcludes[spellchecker].has(text)) {
        return true
      } else {
        this._spellcheckers_.provider.switchDictionary(spellchecker)

        return this._spellcheckers_.provider.getSuggestion(text)
      }
    } else {
      return true
    }
  }

  /**
  * Checks if a word is spelt correctly
  * @param text: the word to check
  * @return true if the work is correct
  */
  checkWord (text) {
    if (this.hasPrimarySpellchecker && this.hasSecondarySpellchecker) {
      return this.checkSpellcheckerWord(this._spellcheckers_.primary, text) ||
                this.checkSpellcheckerWord(this._spellcheckers_.secondary, text)
    } else if (this.hasPrimarySpellchecker) {
      return this.checkSpellcheckerWord(this._spellcheckers_.primary, text)
    } else if (this.hasSecondarySpellchecker) {
      return this.checkSpellcheckerWord(this._spellcheckers_.secondary, text)
    } else {
      return true
    }
  }

  /**
  * Gets a list of spelling suggestions
  * @param text: the text to get suggestions for
  * @return a list of words
  */
  suggestions (text) {
    return {
      primary: this.hasPrimarySpellchecker ? {
        language: this._spellcheckers_.primary,
        suggestions: this.checkSpellcheckerWord(this._spellcheckers_.primary, text)
      } : null,
      secondary: this.hasSecondarySpellchecker ? {
        language: this._spellcheckers_.secondary.language,
        suggestions: this.checkSpellcheckerWord(this._spellcheckers_.secondary, text)
      } : null
    }
  }

  /* **************************************************************************/
  // Updating spellchecker
  /* **************************************************************************/

  /**
  * Updates the provider by giving the languages as the primary language
  */
  updateProvider () {
    const language = this._spellcheckers_.primary || window.navigator.language
    webFrame.setSpellCheckProvider(language, true, {
      spellCheck: (text) => { return this.checkWord(text) }
    })
  }

  /**
  * Updates the spellchecker with the correct language
  * @param primaryLanguage: the language to change the spellcheck to
  * @param secondaryLanguage: the secondary language to change the spellcheck to
  */
  updateSpellchecker (primaryLanguage, secondaryLanguage) {
    if (this._spellcheckers_.primary !== primaryLanguage) {
      if (this._spellcheckers_.primary !== null) {
        this._spellcheckers_.provider.unloadDictionary(this._spellcheckers_.primary)
      }

      if (!primaryLanguage) {
        this._spellcheckers_.primary = null
      } else {
        this._spellcheckers_.primary = primaryLanguage
        DictionaryLoad.load(primaryLanguage).then((dic) => {
          this._spellcheckers_.provider.loadDictionary(primaryLanguage, dic.dic, dic.aff)
          this.updateProvider()
        }, (err) => elconsole.error('Failed to load dictionary', err))
      }
    }

    if (this._spellcheckers_.secondary !== secondaryLanguage) {
      if (this._spellcheckers_.secondary !== null) {
        this._spellcheckers_.provider.unloadDictionary(this._spellcheckers_.secondary)
      }

      if (!secondaryLanguage) {
        this._spellcheckers_.secondary = null
      } else {
        this._spellcheckers_.secondary = secondaryLanguage
        DictionaryLoad.load(secondaryLanguage).then((dic) => {
          this._spellcheckers_.provider.loadDictionary(secondaryLanguage, dic.dic, dic.aff)
        }, (err) => elconsole.error('Failed to load dictionary', err))
      }
    }
  }
}

module.exports = Spellchecker
