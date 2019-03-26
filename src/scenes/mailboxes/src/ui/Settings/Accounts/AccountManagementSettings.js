const React = require('react')
const Colors = require('@material-ui/core/colors')
const { Paper, Button, Icon } = require('@material-ui/core')
const mailboxActions = require('../../../stores/mailbox/mailboxActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')
const TimerMixin = require('react-timer-mixin')

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AccountManagementSettings',
  mixins: [TimerMixin],
  propTypes: {
    mailbox: React.PropTypes.object.isRequired
  },

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentWillMount () {
    this.confirmingDeleteTO = null
  },

  componentWillReceiveProps (nextProps) {
    if (this.props.mailbox.id !== nextProps.mailbox.id) {
      this.setState({ confirmingDelete: false })
      this.clearTimeout(this.confirmingDeleteTO)
    }
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState () {
    return {
      confirmingDelete: false
    }
  },

  /* **************************************************************************/
  // UI Events
  /* **************************************************************************/

  /**
  * Handles the delete button being tapped
  */
  handleDeleteTapped (evt) {
    if (this.state.confirmingDelete) {
      mailboxActions.remove(this.props.mailbox.id)
    } else {
      this.setState({ confirmingDelete: true })
      this.confirmingDeleteTO = this.setTimeout(() => {
        this.setState({ confirmingDelete: false })
      }, 4000)
    }
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const passProps = Object.assign({}, this.props)
    delete passProps.mailbox

    return (
      <Paper zDepth={1} style={styles.paper} {...passProps}>
        <Button
          label={this.state.confirmingDelete ? 'Click again to confirm' : 'Delete Account'}
          icon={<Icon color={Colors.red} className='material-icons'>delete</Icon>}
          labelStyle={{color: Colors.red}}
          onTouchTap={this.handleDeleteTapped} />
      </Paper>
    )
  }
})
