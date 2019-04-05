const React = require('react')
const {Paper} = require('@material-ui/core')
const styles = require('../settingStyles')
const { remote } = window.nativeRequire('electron')
const { shell } = remote
const { WEB_URL, GITHUB_URL, GITHUB_ISSUE_URL } = require('shared/constants')
const {mailboxDispatch} = require('../../../Dispatch')
const mailboxStore = require('../../../stores/mailbox/mailboxStore')
const pkg = window.appPackage()
const AppTheme = require('../../appTheme')

module.exports = class InfoSettingsSection extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  /* **************************************************************************/
  // UI Event
  /* **************************************************************************/

  /**
  * Shows a snapshot of the current memory consumed
  */
  handleShowMemoryInfo = (evt) => {
    evt.preventDefault()

    const sizeToMb = (size) => { return Math.round(size / 1024) }

    mailboxDispatch.fetchProcessMemoryInfo().then((mailboxesProc) => {
      const mailboxProcIndex = mailboxesProc.reduce((acc, info) => {
        acc[info.mailboxId] = info.memoryInfo
        return acc
      }, {})
      const mailboxes = mailboxStore.getState().mailboxIds().map((mailboxId, index) => {
        if (mailboxProcIndex[mailboxId]) {
          return `Mailbox ${index + 1}: ${sizeToMb(mailboxProcIndex[mailboxId].workingSetSize)}mb`
        } else {
          return `Mailbox ${index + 1}: No info`
        }
      })

      window.alert([
        `Main Process ${sizeToMb(remote.process.getProcessMemoryInfo().workingSetSize)}mb`,
        `Mailboxes Window ${sizeToMb(process.getProcessMemoryInfo().workingSetSize)}mb`,
        ''
      ].concat(mailboxes).join('\n'))
    })
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    return (
      <Paper style={styles.paper} {...this.props}>
        <a
          style={{color: AppTheme.palette.linkColor, fontSize: '85%', marginBottom: 10, display: 'block'}}
          onClick={(evt) => { evt.preventDefault(); shell.openExternal(WEB_URL) }}
          href={WEB_URL}>openGWMail Website</a>
        <a
          style={{color: AppTheme.palette.linkColor, fontSize: '85%', marginBottom: 10, display: 'block'}}
          onClick={(evt) => { evt.preventDefault(); shell.openExternal(GITHUB_URL) }}
          href={GITHUB_URL}>openGWMail GitHub</a>
        <a
          style={{color: AppTheme.palette.linkColor, fontSize: '85%', marginBottom: 10, display: 'block'}}
          onClick={(evt) => { evt.preventDefault(); shell.openExternal(GITHUB_ISSUE_URL) }}
          href={GITHUB_ISSUE_URL}>Report a bug</a>
        <a
          style={{color: AppTheme.palette.linkColor, fontSize: '85%', marginBottom: 10, display: 'block'}}
          onClick={this.handleShowMemoryInfo}
          href='#'>Memory Info</a>
        <div style={{ fontSize: '85%' }}>
          <p>
            {`Version ${pkg.version} ${pkg.prerelease ? 'Prerelease' : ''}`}
          </p>
          <p>
            Made with ♥ by the openGWMail Community
          </p>
        </div>
      </Paper>
    )
  }
}
