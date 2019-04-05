const PropTypes = require('prop-types');
const React = require('react')
const { TextField, Paper, FormControlLabel, FormControl, FormGroup } = require('@material-ui/core')
const { Container, Row, Col } = require('../../Components/Grid')
const { FormControlFullWidth, Switch } = require('../../Components/Mui')
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
        <Paper style={styles.paper}>
          <h1 style={styles.subheading}>Proxy Server</h1>
          <FormControlFullWidth>
            <FormControlLabel
              control={
                <Switch
                  name='proxyEnabled'
                  defaultChecked={proxyEnabled}
                  onChange={this.handleProxyToggle}/>
              }
              label="Enable Proxy Server"
            />
          </FormControlFullWidth>
          <small>You also need to set the proxy settings on your OS to ensure all requests use the server</small>
          <Container fluid>
            <Row>
              <Col xs={6}>
                <TextField
                  ref='proxy_host'
                  placeholder='http://192.168.1.1'
                  label='Proxy Server Host'
                  defaultValue={proxyHost}
                  onChange={this.handleProxyValueChanged}
                  disabled={!proxyEnabled} />
              </Col>
              <Col xs={6}>
                <TextField
                  ref='proxy_port'
                  placeholder='8080'
                  label='Proxy Server Port'
                  defaultValue={proxyPort}
                  onChange={this.handleProxyValueChanged}
                  disabled={!proxyEnabled} />
              </Col>
            </Row>
          </Container>
        </Paper>
        <Paper style={styles.paper}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={app.ignoreGPUBlacklist}
                  onChange={(evt, toggled) => {
                    showRestart()
                    flux.settings.A.ignoreGPUBlacklist(toggled)
                  }}/>
              }
              label='Ignore GPU Blacklist (Requires Restart)'
            />
            <FormControlLabel
              control={
                <Switch
                  checked={app.enableUseZoomForDSF}
                  onChange={(evt, toggled) => {
                    showRestart()
                    flux.settings.A.enableUseZoomForDSF(toggled)
                  }}/>
              }
              label='Use Zoom For DSF (Requires Restart)'
            />
            <FormControlLabel
              control={
                <Switch
                  checked={app.disableSmoothScrolling}
                  onChange={(evt, toggled) => {
                    showRestart()
                    flux.settings.A.disableSmoothScrolling(toggled)
                  }}/>
              }
              label='Disable Smooth Scrolling (Requires Restart)'
            />
            <FormControlLabel
              control={
                <Switch
                  checked={app.checkForUpdates}
                  onChange={(evt, toggled) => {
                    showRestart()
                    flux.settings.A.checkForUpdates(toggled)
                  }}/>
              }
              label='Check for updates'
            />
          </FormGroup>
        </Paper>
      </div>
    )
  }
}
