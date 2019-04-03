const React = require('react')
const { IconButton } = require('@material-ui/core')
const Colors = require('@material-ui/core/colors')
const { appWizardActions } = require('../../stores/appWizard')
const styles = require('./SidelistStyles')
const ReactTooltip = require('react-tooltip')

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
          iconClassName='fa fa-fw fa-magic'
          onClick={() => appWizardActions.startWizard()}
          iconStyle={{ color: Colors.yellow }} />
        <ReactTooltip
          id='ReactComponent-Sidelist-Item-Wizard'
          place='right'
          type='dark'
          effect='solid' />
      </div>
    )
  }
}
