const React = require('react')
const { IconButton } = require('@material-ui/core')
const Colors = require('@material-ui/core/colors')
const styles = require('./SidelistStyles')
const ReactTooltip = require('react-tooltip')
const { mailboxWizardActions } = require('../../stores/mailboxWizard')
const { AddCircle } = require('@material-ui/icons')

module.exports = class SidelistItemAddMailbox extends React.Component {
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
        data-tip='Add Mailbox'
        data-for='ReactComponent-Sidelist-Item-Add-Mailbox'>
        <IconButton
          onClick={() => mailboxWizardActions.openAddMailbox()}
          style={{ color: Colors.blueGrey['400'] }}>
          <AddCircle />
        </IconButton>
        <ReactTooltip
          id='ReactComponent-Sidelist-Item-Add-Mailbox'
          place='right'
          type='dark'
          effect='solid' />
      </div>
    )
  }
}
