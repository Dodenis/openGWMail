const React = require('react')
const { IconButton } = require('@material-ui/core')
const Colors = require('@material-ui/core/colors')
const { appWizardActions } = require('../../stores/appWizard')
const styles = require('./SidelistStyles')
const ReactTooltip = require('react-tooltip')
const { FlashOn } = require('@material-ui/icons')

module.exports = class SidelistItemWizard extends React.Component {
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
        data-tip='Setup Wizard'
        data-for='ReactComponent-Sidelist-Item-Wizard'>
        <IconButton
          onClick={() => appWizardActions.startWizard()}
          style={{ color: Colors.yellow }} >
          <FlashOn />
        </IconButton>
        <ReactTooltip
          id='ReactComponent-Sidelist-Item-Wizard'
          place='right'
          type='dark'
          effect='solid' />
      </div>
    )
  }
}
