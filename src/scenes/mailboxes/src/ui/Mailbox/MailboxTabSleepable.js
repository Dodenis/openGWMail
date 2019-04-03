const React = require('react')
const MailboxTab = require('./MailboxTab')
const { mailboxStore } = require('../../stores/mailbox')
const { MAILBOX_SLEEP_WAIT } = require('shared/constants')

const REF = 'mailboxTab'

module.exports = class MailboxTabSleepable extends React.Component {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = Object.assign({}, MailboxTab.propTypes);

  constructor (props) {
    super(props)

    this.state = this.getInitialPropState()
  }

  /* **************************************************************************/
  // Component lifecylce
  /* **************************************************************************/

  componentDidMount() {
    this.sleepWait = null

    mailboxStore.listen(this.mailboxUpdated)
  }

  componentWillUnmount() {
    clearTimeout(this.sleepWait)

    mailboxStore.unlisten(this.mailboxUpdated)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.mailboxId !== nextProps.mailboxId || this.props.service !== nextProps.service) {
      clearTimeout(this.sleepWait)
      this.setState(this.getInitialPropState(nextProps))
    }
  }

  /* **************************************************************************/
  // Data lifecylce
  /* **************************************************************************/

  getInitialPropState = (props = this.props) => {
    const mailboxState = mailboxStore.getState()
    const isActive = mailboxState.isActive(props.mailboxId, props.service)
    const mailbox = mailboxState.getMailbox(props.mailboxId)
    return {
      isActive: isActive,
      isSleeping: !isActive,
      allowsSleeping: mailbox ? (new Set(mailbox.sleepableServices)).has(props.service) : true
    }
  };

  mailboxUpdated = (mailboxState) => {
    this.setState((prevState) => {
      const mailbox = mailboxState.getMailbox(this.props.mailboxId)
      const update = {
        isActive: mailboxState.isActive(this.props.mailboxId, this.props.service),
        allowsSleeping: mailbox ? (new Set(mailbox.sleepableServices)).has(this.props.service) : true
      }
      if (prevState.isActive !== update.isActive) {
        clearTimeout(this.sleepWait)
        if (prevState.isActive && !update.isActive) {
          this.sleepWait = setTimeout(() => {
            this.setState({ isSleeping: true })
          }, MAILBOX_SLEEP_WAIT)
        } else {
          update.isSleeping = false
        }
      }
      return update
    })
  };

  /* **************************************************************************/
  // Webview pass throughs
  /* **************************************************************************/

  send = (...args) => {
    if (this.refs[REF]) {
      return this.refs[REF].send.apply(this, Array.from(args))
    } else {
      throw new Error('MailboxTab is sleeping')
    }
  };

  sendWithResponse = (...args) => {
    if (this.refs[REF]) {
      return this.refs[REF].sendWithResponse.apply(this, Array.from(args))
    } else {
      throw new Error('MailboxTab is sleeping')
    }
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    if (this.state.allowsSleeping && this.state.isSleeping) {
      return false
    } else {
      return (<MailboxTab ref={REF} {...this.props} />)
    }
  }
}
