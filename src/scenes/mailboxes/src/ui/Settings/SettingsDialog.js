const PropTypes = require('prop-types');
const React = require('react')
const {
  Dialog, RaisedButton,
  Tabs, Tab
} = require('material-ui')
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
    onRequestClose: PropTypes.func.isRequired,
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
  handleTabChange = (value) => {
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
    const { onRequestClose, initialRoute, open } = this.props

    const buttons = showRestart ? (
      <div style={{ textAlign: 'right' }}>
        <RaisedButton label='Close' style={{ marginRight: 16 }} onClick={onRequestClose} />
        <RaisedButton label='Restart' primary onClick={() => ipcRenderer.send('relaunch-app', { })} />
      </div>
    ) : (
      <div style={{ textAlign: 'right' }}>
        <RaisedButton label='Close' primary onClick={onRequestClose} />
      </div>
    )

    const heading = (
      <div style={{ height: 48 }} />
    )

    return (
      <Dialog
        modal={false}
        contentStyle={styles.dialog}
        title={heading}
        actions={buttons}
        open={open}
        bodyStyle={{ padding: 0 }}
        titleStyle={{ padding: 0 }}
        autoScrollBodyContent
        onRequestClose={onRequestClose}>
        <Tabs
          tabItemContainerStyle={{ position: 'absolute', top: 0, zIndex: 10 }}
          inkBarStyle={{ position: 'absolute', top: 48, zIndex: 15 }}
          value={currentTab}
          onChange={this.handleTabChange}
          contentContainerStyle={{ padding: 24 }}>
          <Tab label='General' value='general'>
            {currentTab !== 'general' ? undefined : (
              <GeneralSettings showRestart={this.handleShowRestart} />
            )}
          </Tab>
          <Tab label='Accounts' value='accounts'>
            {currentTab !== 'accounts' ? undefined : (
              <AccountSettings
                showRestart={this.handleShowRestart}
                initialMailboxId={(initialRoute || {}).mailboxId} />
            )}
          </Tab>
          <Tab label='Advanced' value='advanced'>
            {currentTab !== 'advanced' ? undefined : (
              <AdvancedSettings showRestart={this.handleShowRestart} />
            )}
          </Tab>
        </Tabs>
      </Dialog>
    )
  }
}
