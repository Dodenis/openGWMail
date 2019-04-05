const PropTypes = require('prop-types');
const React = require('react')
const Colors = require('@material-ui/core/colors')
const { Paper, Button, Icon } = require('@material-ui/core')
const { Delete } = require('@material-ui/icons')
const mailboxActions = require('../../../stores/mailbox/mailboxActions')
const styles = require('../settingStyles')
const TimerMixin = require('react-timer-mixin')
const reactMixin = require('react-mixin');
const toUnsafe = require('react-mixin/toUnsafe');

class AccountManagementSettings extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    mailbox: PropTypes.object.isRequired
  };

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  state = {
    confirmingDelete: false
  };

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentWillMount() {
    this.confirmingDeleteTO = null
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.mailbox.id !== nextProps.mailbox.id) {
      this.setState({ confirmingDelete: false })
      this.clearTimeout(this.confirmingDeleteTO)
    }
  }

  /* **************************************************************************/
  // UI Events
  /* **************************************************************************/

  /**
  * Handles the delete button being tapped
  */
  handleDeleteTapped = (evt) => {
    if (this.state.confirmingDelete) {
      mailboxActions.remove(this.props.mailbox.id)
    } else {
      this.setState({ confirmingDelete: true })
      this.confirmingDeleteTO = this.setTimeout(() => {
        this.setState({ confirmingDelete: false })
      }, 4000)
    }
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const passProps = Object.assign({}, this.props)
    delete passProps.mailbox

    return (
      <Paper style={styles.paper} {...passProps}>
        <Button
          fullWidth
          color="secondary"
          onClick={this.handleDeleteTapped}
        >
          <Delete />
          {this.state.confirmingDelete ? 'Click again to confirm' : 'Delete Account'}
        </Button>
      </Paper>
    )
  }
}

let fixedTimerMixin = toUnsafe(TimerMixin)

reactMixin(AccountManagementSettings.prototype, fixedTimerMixin)

module.exports = AccountManagementSettings
