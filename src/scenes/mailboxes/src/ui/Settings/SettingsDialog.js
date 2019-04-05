const PropTypes = require('prop-types');
const React = require('react')
const { AppBar, Dialog, DialogTitle, DialogActions, DialogContent, Button, Tabs, Tab, TabContainer } = require('@material-ui/core')
const GeneralSettings = require('./GeneralSettings')
const AccountSettings = require('./AccountSettings')
const AdvancedSettings = require('./AdvancedSettings')
const styles = require('./settingStyles')
const { ipcRenderer } = window.nativeRequire('electron')

module.exports = class SettingsDialog extends React.Component {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    initialRoute: PropTypes.object
  };

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  state = {
    currentTab: (this.props.initialRoute || {}).tab || 'general',
    showRestart: false
  };

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open) {
      const updates = { showRestart: false }
      if (nextProps.open) {
        updates.currentTab = (nextProps.initialRoute || {}).tab || 'general'
      }
      this.setState(updates)
    }
  }

  /* **************************************************************************/
  // User Interaction
  /* **************************************************************************/

  /**
  * Changes the tab
  */
  handleTabChange = (event, value) => {
    if (typeof (value) === 'string') {
      this.setState({ currentTab: value })
    }
  };

  /**
  * Shows the option to restart
  */
  handleShowRestart = () => {
    this.setState({ showRestart: true })
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.currentTab !== nextState.currentTab) { return true }
    if (this.state.showRestart !== nextState.showRestart) { return true }
    if (nextProps.open !== this.props.open) { return true }

    return false
  }

  render() {
    const { showRestart, currentTab } = this.state
    const { onClose, initialRoute, open } = this.props

    const buttons = showRestart ? (
      <div style={{ textAlign: 'right' }}>
        <Button variant='contained' style={{ marginRight: 16 }} onClick={onClose}>
          Close
        </Button>
        <Button variant='contained' color="primary" onClick={() => ipcRenderer.send('relaunch-app', { })}>
          Restart
        </Button>
      </div>
    ) : (
      <div style={{ textAlign: 'right' }}>
        <Button variant='contained' color="primary" onClick={onClose}>
          Close
        </Button>
      </div>
    )

    const heading = (
      <div style={{ height: 48 }} />
    )

    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle style={{padding: 0}}>
          <AppBar position="static">
            <Tabs
              variant="fullWidth"
              // tabItemContainerStyle={{ position: 'absolute', top: 0, zIndex: 10 }}
              // inkBarStyle={{ position: 'absolute', top: 48, zIndex: 15 }}
              value={currentTab}
              onChange={this.handleTabChange}
              // contentContainerStyle={{ padding: 24 }}>
            >
              <Tab label='General' value='general' />
              <Tab label='Accounts' value='accounts' />
              <Tab label='Advanced' value='advanced' />
            </Tabs>
          </AppBar>
        </DialogTitle>
        <DialogContent>
          {currentTab === 'general' && <GeneralSettings showRestart={this.handleShowRestart} />}
          {currentTab === 'accounts' && <AccountSettings
              showRestart={this.handleShowRestart}
              initialMailboxId={(initialRoute || {}).mailboxId} />
          }
          {currentTab === 'advanced' && <AdvancedSettings showRestart={this.handleShowRestart} />}
        </DialogContent>
        <DialogActions>
          {buttons}
        </DialogActions>
      </Dialog>
    )
  }
}
