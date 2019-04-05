const React = require('react')
const reactMixin = require('react-mixin');
const toUnsafe = require('react-mixin/toUnsafe');
const TimerMixin = require('react-timer-mixin')
const compareVersion = require('compare-version')
const { UPDATE_CHECK_URL, UPDATE_CHECK_INTERVAL, UPDATE_DOWNLOAD_URL } = require('shared/constants')
const { Button, Dialog, DialogTitle, DialogContent, DialogActions } = require('@material-ui/core')
const settingsStore = require('../stores/settings/settingsStore')
const settingsActions = require('../stores/settings/settingsActions')
const pkg = window.appPackage()
const {
  remote: {shell}
} = window.nativeRequire('electron')

class UpdateCheckDialog extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  state = {
    newerVersion: null,
    recheckRestart: false
  };

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount() {
    this.recheckTO = null
    this.checkNow()
  }

  /* **************************************************************************/
  // Checking
  /* **************************************************************************/

  /**
  * Checks with the server for an update
  */
  checkNow = () => {
    Promise.resolve()
      .then(() => window.fetch(`${UPDATE_CHECK_URL}?_=${new Date().getTime()}`))
      .then((res) => res.ok ? Promise.resolve(res) : Promise.reject(res))
      .then((res) => res.json())
      .then((res) => {
        let update
        if (pkg.prerelease) {
          if (compareVersion(res.prerelease.version, res.release.version) >= 1) { // prerelease is newest
            if (compareVersion(res.prerelease.version, pkg.version) >= 1) {
              update = res.prerelease.version
            }
          } else { // release is newest
            if (compareVersion(res.release.version, pkg.version) >= 1) {
              update = res.release.version
            }
          }
        } else {
          if (compareVersion(res.release.version, pkg.version) >= 1) {
            update = res.release.version
          }
        }

        // if (pkg.prerelease) {
        //   if (res.prerelease.news) {
        //     settingsActions.updateLatestNews(res.prerelease.news)
        //   }
        // } else {
        //   if (res.release.news) {
        //     settingsActions.updateLatestNews(res.release.news)
        //   }
        // }

        if (update) {
          if (this.state.recheckRestart || settingsStore.getState().app.checkForUpdates === false) {
            this.scheduleNextCheck()
          } else {
            this.setState({ newerVersion: update })
            this.clearTimeout(this.recheckTO)
          }
        } else {
          this.setState({ newerVersion: null })
          this.scheduleNextCheck()
        }
      })
  };

  /**
  * Schedules the next check
  */
  scheduleNextCheck = () => {
    this.clearTimeout(this.recheckTO)
    this.recheckTO = this.setTimeout(() => {
      this.checkNow()
    }, UPDATE_CHECK_INTERVAL)
  };

  /**
  * Dismisses the modal an waits for the next check
  */
  recheckLater = () => {
    this.setState({ newerVersion: null })
    this.scheduleNextCheck()
  };

  /**
  * Cancels the recheck and rechecks after reboot
  */
  recheckRestart = () => {
    this.setState({
      newerVersion: null,
      recheckRestart: true
    })
    this.recheckLater()
  };

  /**
  * Opens the download link
  */
  downloadNow = () => {
    shell.openExternal(UPDATE_DOWNLOAD_URL)
    this.recheckLater()
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const buttons = [
      (<Button
        key='restart'
        style={{ marginRight: 16 }}
        onClick={this.recheckRestart}
      >
        After Restart
      </Button>),
      (<Button
        key='later'
        style={{ marginRight: 16 }}
        onClick={this.recheckLater}
      >
        Later
      </Button>),
      (<Button
        variant='contained'
        key='now'
        color="primary"
        onClick={this.downloadNow}
      >
        Download Now
      </Button>)
    ]

    return (
      <Dialog
        open={this.state.newerVersion !== null}
        onClose={this.recheckLater}
      >
        <DialogTitle>
          Update Available
        </DialogTitle>
        <DialogContent>
          <p>
            <span>Version </span>
            <span>{this.state.newerVersion}</span>
            <span> is now available. Do you want to download it now?</span>
          </p>
        </DialogContent>
        <DialogActions>
          {buttons}
        </DialogActions>
      </Dialog>
    )
  }
}

let fixedTimerMixin = toUnsafe(TimerMixin)

reactMixin(UpdateCheckDialog.prototype, fixedTimerMixin)

module.exports = UpdateCheckDialog
