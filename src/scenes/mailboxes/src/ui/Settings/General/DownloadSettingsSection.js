const PropTypes = require('prop-types');
const React = require('react')
const ReactDOM = require('react-dom')
const { Paper, Button, Icon, FormControlLabel } = require('@material-ui/core')
const { Folder } = require('@material-ui/icons')
const settingsActions = require('../../../stores/settings/settingsActions')
const Switch = require('../../../Components/Switch')
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
      <Paper style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Downloads</h1>
        <div>
          <FormControlLabel
            control={
              <Switch
                checked={os.alwaysAskDownloadLocation}
                onChange={(evt, toggled) => settingsActions.setAlwaysAskDownloadLocation(toggled)}/>
            }
            label='Always ask download location'
          />
        </div>
        <div style={Object.assign({}, styles.button, { display: 'flex', alignItems: 'center' })}>
          <input
            type='file'
            style={styles.fileInput}
            ref='defaultDownloadInput'
            disabled={os.alwaysAskDownloadLocation}
            onChange={(evt) => settingsActions.setDefaultDownloadLocation(evt.target.files[0].path)}
            id="select-location-button"
          />
          <label htmlFor="select-location-button">
            <Button
              variant='contained'
              component='span'
              disabled={os.alwaysAskDownloadLocation}
              style={styles.fileInputButton}
            >
              <Folder />
              Select location
            </Button>
          </label>
          {os.alwaysAskDownloadLocation ? undefined : <small>{os.defaultDownloadLocation}</small>}
        </div>
      </Paper>
    )
  }
}
