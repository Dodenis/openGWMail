const React = require('react')
const { IconButton } = require('@material-ui/core')
const Colors = require('@material-ui/core/colors')
const {navigationDispatch} = require('../../Dispatch')
const styles = require('./SidelistStyles')
const ReactTooltip = require('react-tooltip')
const { Settings } = require('@material-ui/icons')

module.exports = class SidelistItemSettings extends React.Component {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  /**
  * Renders the app
  */
  render() {
    const { style, ...passProps } = this.props
    return (
      <div
        {...passProps}
        style={Object.assign({}, styles.itemContainer, style)}
        data-tip='Settings'
        data-for='ReactComponent-Sidelist-Item-Settings'>
        <IconButton
          onClick={() => navigationDispatch.openSettings()}
          style={{ color: Colors.blueGrey['400'] }}>
          <Settings />
        </IconButton>
        <ReactTooltip
          id='ReactComponent-Sidelist-Item-Settings'
          place='right'
          type='dark'
          effect='solid' />
      </div>
    )
  }
}
