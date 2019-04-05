const PropTypes = require('prop-types');
const React = require('react')
const { Paper, Button, Icon } = require('@material-ui/core')
const { Code } = require('@material-ui/icons')
const CustomCodeEditingModal = require('./CustomCodeEditingModal')
const mailboxActions = require('../../../stores/mailbox/mailboxActions')
const styles = require('../settingStyles')
const {mailboxDispatch} = require('../../../Dispatch')
const { USER_SCRIPTS_WEB_URL } = require('shared/constants')
const AppTheme = require('../../appTheme')
const {
  remote: {shell}
} = window.nativeRequire('electron')

module.exports = class AccountCustomCodeSettings extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    mailbox: PropTypes.object.isRequired
  };

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  state = {
    editingCSS: false,
    editingJS: false
  };

  /* **************************************************************************/
  // User Interaction
  /* **************************************************************************/

  handleSave = (evt, code) => {
    if (this.state.editingCSS) {
      mailboxActions.setCustomCSS(this.props.mailbox.id, code)
    } else if (this.state.editingJS) {
      mailboxActions.setCustomJS(this.props.mailbox.id, code)
    }

    this.setState({ editingJS: false, editingCSS: false })
    mailboxDispatch.reloadAllServices(this.props.mailbox.id)
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { mailbox, ...passProps } = this.props
    let editingCode
    let editingTitle
    if (this.state.editingCSS) {
      editingCode = mailbox.customCSS
      editingTitle = 'Custom CSS'
    } else if (this.state.editingJS) {
      editingCode = mailbox.customJS
      editingTitle = 'Custom JS'
    }

    return (
      <Paper style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Custom Code</h1>
        <div style={styles.button}>
          <Button
            fullWidth
            variant='contained'
            onClick={() => this.setState({ editingCSS: true, editingJS: false })}
          >
            <Code />
            Custom CSS
          </Button>
        </div>
        <div style={styles.button}>
          <Button
            fullWidth
            variant='contained'
            onClick={() => this.setState({ editingCSS: false, editingJS: true })}
          >
            <Code />
            Custom JavaScript
          </Button>
        </div>
        <div style={styles.button}>
          <a
            style={{color: AppTheme.palette.linkColor, fontSize: '85%', marginBottom: 10, display: 'block'}}
            onClick={(evt) => { evt.preventDefault(); shell.openExternal(USER_SCRIPTS_WEB_URL) }}
            href={USER_SCRIPTS_WEB_URL}>Find custom userscripts</a>
        </div>
        <CustomCodeEditingModal
          open={this.state.editingCSS || this.state.editingJS}
          title={editingTitle}
          code={editingCode}
          onCancel={() => this.setState({ editingCSS: false, editingJS: false })}
          onSave={this.handleSave} />
      </Paper>
    )
  }
}
