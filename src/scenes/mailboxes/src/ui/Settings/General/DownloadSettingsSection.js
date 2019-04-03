const PropTypes = require('prop-types');
const React = require('react')
const ReactDOM = require('react-dom')
const { Switch, Paper, Button, Icon } = require('@material-ui/core')
const settingsActions = require('../../../stores/settings/settingsActions')
const styles = require('../settingStyles')

module.exports = class DownloadSettingsSection extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    os: PropTypes.object.isRequired
  };

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.defaultDownloadInput).setAttribute('webkitdirectory', 'webkitdirectory')
  }

  componentDidUpdate() {
    ReactDOM.findDOMNode(this.refs.defaultDownloadInput).setAttribute('webkitdirectory', 'webkitdirectory')
  }

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const {os, ...passProps} = this.props

    return (
      <Paper zDepth={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Downloads</h1>
        <div>
          <Switch
            checked={os.alwaysAskDownloadLocation}
            label='Always ask download location'
            labelPosition='right'
            onChange={(evt, toggled) => settingsActions.setAlwaysAskDownloadLocation(toggled)} />
        </div>
        <div style={Object.assign({}, styles.button, { display: 'flex', alignItems: 'center' })}>
          <Button
            variant='contained'
            label='Select location'
            icon={<Icon className='material-icons'>folder</Icon>}
            containerElement='label'
            disabled={os.alwaysAskDownloadLocation}
            style={styles.fileInputButton}>
            <input
              type='file'
              style={styles.fileInput}
              ref='defaultDownloadInput'
              disabled={os.alwaysAskDownloadLocation}
              onChange={(evt) => settingsActions.setDefaultDownloadLocation(evt.target.files[0].path)} />
          </Button>
          {os.alwaysAskDownloadLocation ? undefined : <small>{os.defaultDownloadLocation}</small>}
        </div>
      </Paper>
    )
  }
}
