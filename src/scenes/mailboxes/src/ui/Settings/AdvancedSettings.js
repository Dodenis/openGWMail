const PropTypes = require('prop-types');
const React = require('react')
const { Switch, TextField, Paper } = require('@material-ui/core')
const { Container, Row, Col } = require('../../Components/Grid')
const flux = {
  settings: require('../../stores/settings')
}
const styles = require('./settingStyles')

module.exports = class AdvancedSettings extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    showRestart: PropTypes.func.isRequired
  };

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  componentDidMount() {
    flux.settings.S.listen(this.settingsChanged)
  }

  componentWillUnmount() {
    flux.settings.S.unlisten(this.settingsChanged)
  }

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  /**
  * Generates the state from the settings
  * @param store=settingsStore: the store to use
  */
  generateState = (store = flux.settings.S.getState()) => {
    return {
      proxyEnabled: store.proxy.enabled,
      proxyHost: store.proxy.host || '',
      proxyPort: store.proxy.port || '',
      app: store.app
    }
  };

  settingsChanged = (store) => {
    this.setState(this.generateState(store))
  };

  /* **************************************************************************/
  // User Interaction
  /* **************************************************************************/

  /**
  * Enables / disables the proxy server
  */
  handleProxyToggle = (evt, toggled) => {
    flux.settings.A[toggled ? 'enableProxyServer' : 'disableProxyServer']()
  };

  handleProxyValueChanged = (event) => {
    flux.settings.A.enableProxyServer(
      this.refs.proxy_host.getValue(),
      this.refs.proxy_port.getValue()
    )
  };

  state = this.generateState();

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { proxyEnabled, proxyPort, proxyHost, app } = this.state
    const { showRestart, ...passProps } = this.props

    return (
      <div {...passProps}>
        <Paper zDepth={1} style={styles.paper}>
          <h1 style={styles.subheading}>Proxy Server</h1>
          <Switch
            name='proxyEnabled'
            defaultChecked={proxyEnabled}
            label='Enable Proxy Server'
            onChange={this.handleProxyToggle} />
          <small>You also need to set the proxy settings on your OS to ensure all requests use the server</small>
          <Container fluid>
            <Row>
              <Col xs={6}>
                <TextField
                  ref='proxy_host'
                  hintText='http://192.168.1.1'
                  floatingLabelText='Proxy Server Host'
                  defaultValue={proxyHost}
                  onChange={this.handleProxyValueChanged}
                  disabled={!proxyEnabled} />
              </Col>
              <Col xs={6}>
                <TextField
                  ref='proxy_port'
                  hintText='8080'
                  floatingLabelText='Proxy Server Port'
                  defaultValue={proxyPort}
                  onChange={this.handleProxyValueChanged}
                  disabled={!proxyEnabled} />
              </Col>
            </Row>
          </Container>
        </Paper>
        <Paper zDepth={1} style={styles.paper}>
          <Switch
            checked={app.ignoreGPUBlacklist}
            label='Ignore GPU Blacklist (Requires Restart)'
            labelPosition='right'
            onChange={(evt, toggled) => {
              showRestart()
              flux.settings.A.ignoreGPUBlacklist(toggled)
            }} />
          <Switch
            checked={app.enableUseZoomForDSF}
            label='Use Zoom For DSF (Requires Restart)'
            labelPosition='right'
            onChange={(evt, toggled) => {
              showRestart()
              flux.settings.A.enableUseZoomForDSF(toggled)
            }} />
          <Switch
            checked={app.disableSmoothScrolling}
            label='Disable Smooth Scrolling (Requires Restart)'
            labelPosition='right'
            onChange={(evt, toggled) => {
              showRestart()
              flux.settings.A.disableSmoothScrolling(toggled)
            }} />
          <Switch
            checked={app.checkForUpdates}
            label='Check for updates'
            labelPosition='right'
            onChange={(evt, toggled) => {
              showRestart()
              flux.settings.A.checkForUpdates(toggled)
            }} />
        </Paper>
      </div>
    )
  }
}
