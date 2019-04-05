const React = require('react')
const {
  Dialog, Button, FormControlLabel,
  TableBody, TableRow, TableCell, DialogContent, DialogActions, DialogTitle
} = require('@material-ui/core')
const { Switch, Checkbox, Table } = require('../../Components/Mui')
const { mailboxWizardStore, mailboxWizardActions } = require('../../stores/mailboxWizard')
const { Mailbox } = require('shared/Models/Mailbox')

const styles = {
  introduction: {
    textAlign: 'center',
    padding: 12,
    fontSize: '110%',
    fontWeight: 'bold'
  },
  actionCell: {
    width: 48,
    paddingLeft: 0,
    paddingRight: 0,
    textAlign: 'center'
  },
  titleCell: {
    paddingLeft: 0,
    paddingRight: 0
  },
  avatar: {
    height: 22,
    width: 22,
    top: 2
  }
}

module.exports = class ConfigureMailboxServicesDialog extends React.Component {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/
  constructor (props) {
    super(props)

    this.state = this.getInitialWizardState()
  }

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount() {
    mailboxWizardStore.listen(this.mailboxWizardChanged)
  }

  componentWillUnmount() {
    mailboxWizardStore.unlisten(this.mailboxWizardChanged)
  }

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialWizardState = (wizardState = mailboxWizardStore.getState()) => {
    return {
      isOpen: wizardState.configureServicesOpen,
      mailboxType: wizardState.provisonaMailboxType(),
      availableServices: wizardState.provisionalMailboxSupportedServices(),
      enabledServices: new Set(wizardState.provisionalDefaultMailboxServices()),
      compactServices: false
    }
  };

  mailboxWizardChanged = (wizardState) => {
    this.setState((prevState) => {
      if (!prevState.isOpen && wizardState.configureServicesOpen) {
        return this.getInitialWizardState(wizardState)
      } else {
        return { isOpen: wizardState.configureServicesOpen }
      }
    })
  };

  /* **************************************************************************/
  // UI Events
  /* **************************************************************************/

  /**
  * Toggles a service
  * @param service: the service type
  * @param toggled: true if its enabled, false otherwise
  */
  handleToggleService = (service, toggled) => {
    this.setState((prevState) => {
      const enabledServices = new Set(Array.from(prevState.enabledServices))
      enabledServices[toggled ? 'add' : 'delete'](service)
      return { enabledServices: enabledServices }
    })
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  /**
  * Renders the service name
  * @param mailboxType: the type of mailbox
  * @param service: the service type
  * @return the human name for the service
  */
  getServiceName = (mailboxType, service) => {
    if (mailboxType === Mailbox.TYPE_GMAIL || mailboxType === Mailbox.TYPE_GINBOX) {
      switch (service) {
        case Mailbox.SERVICES.STORAGE: return 'Google Drive'
        case Mailbox.SERVICES.CONTACTS: return 'Google Contacts'
        case Mailbox.SERVICES.NOTES: return 'Google Keep'
        case Mailbox.SERVICES.CALENDAR: return 'Google Calendar'
        case Mailbox.SERVICES.COMMUNICATION: return 'Google Hangouts'
        case Mailbox.SERVICES.MEET: return 'Google Meet'
        case Mailbox.SERVICES.CHAT: return 'Google Chat'
        case Mailbox.SERVICES.MAPS: return 'Google Maps'
      }
    }

    return ''
  };

  /**
  * @param mailboxType: the type of mailbox
  * @param service: the service type
  * @return the url of the service icon
  */
  getServiceIconUrl = (mailboxType, service) => {
    if (mailboxType === Mailbox.TYPE_GMAIL || mailboxType === Mailbox.TYPE_GINBOX) {
      switch (service) {
        case Mailbox.SERVICES.STORAGE: return '../../images/google_services/logo_drive_128px.png'
        case Mailbox.SERVICES.CONTACTS: return '../../images/google_services/logo_contacts_128px.png'
        case Mailbox.SERVICES.NOTES: return '../../images/google_services/logo_keep_128px.png'
        case Mailbox.SERVICES.CALENDAR: return '../../images/google_services/logo_calendar_128px.png'
        case Mailbox.SERVICES.COMMUNICATION: return '../../images/google_services/logo_hangouts_128px.png'
        case Mailbox.SERVICES.MEET: return '../../images/google_services/logo_meet_128px.png'
        case Mailbox.SERVICES.CHAT: return '../../images/google_services/logo_chat_128px.png'
        case Mailbox.SERVICES.MAPS: return '../../images/google_services/logo_maps_128px.png'
      }
    }

    return ''
  };

  render() {
    const { isOpen, enabledServices, mailboxType, availableServices, compactServices } = this.state
    const actions = (
      <Button
        variant='contained'
        color="primary"
        onClick={() => {
          mailboxWizardActions.configureMailboxServices(Array.from(enabledServices), compactServices)
        }}
      >
        Next
      </Button>
    )

    return (
      <Dialog
        open={isOpen}
      >
        <DialogTitle style={{textAlign: 'center'}}>
          OpenGWMail also gives you access to the other services you use. Pick which
          services you would like to enable for this account
        </DialogTitle>
        <DialogContent>
          <Table>
            <TableBody>
              {availableServices.map((service) => {
                return (
                  <TableRow key={service}>
                    <TableCell style={styles.actionCell}>
                      <img
                        style={styles.avatar}
                        src={this.getServiceIconUrl(mailboxType, service)} />
                    </TableCell>
                    <TableCell style={styles.titleCell}>
                      {this.getServiceName(mailboxType, service)}
                    </TableCell>
                    <TableCell style={styles.actionCell}>
                      <Checkbox
                        onChange={(evt, checked) => this.handleToggleService(service, checked)}
                        checked={enabledServices.has(service)} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          <FormControlLabel
            control={
              <Switch
                checked={compactServices}
                onChange={(evt, toggled) => this.setState({ compactServices: toggled })}
              />
            }
            label='Show sidebar services in compact mode'
          />
        </DialogContent>
        <DialogActions>
          {actions}
        </DialogActions>
      </Dialog>
    )
  }
}
