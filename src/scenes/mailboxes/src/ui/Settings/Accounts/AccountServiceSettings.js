const PropTypes = require('prop-types');
const React = require('react')
const {
  Paper, IconButton, Button, Popover, Menu, MenuItem, FormControlLabel,
  TableBody, TableRow, TableCell, TableHead, Tooltip
} = require('@material-ui/core')
const { ArrowUpward, ArrowDownward, Delete} = require('@material-ui/icons')
const { Switch, Checkbox, Table } = require('../../../Components/Mui')
const mailboxActions = require('../../../stores/mailbox/mailboxActions')
const Mailbox = require('shared/Models/Mailbox/Mailbox')
const Colors = require('@material-ui/core/colors')

const settingStyles = require('../settingStyles')
const serviceStyles = {
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
  },
  disabled: {
    textAlign: 'center',
    fontSize: '85%',
    color: Colors.grey['300']
  }
}

module.exports = class AccountServiceSettings extends React.PureComponent {
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
    addPopoverOpen: false,
    addPopoverAnchor: null
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

  /**
  * Renders the services
  * @param mailbox: the mailbox
  * @param services: the services list
  * @param sleepableServices: the list of services that are able to sleep
  * @return jsx
  */
  renderServices = (mailbox, services, sleepableServices) => {
    if (services.length) {
      const sleepableServicesSet = new Set(sleepableServices)

      return (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={serviceStyles.actionCell} />
              <TableCell style={serviceStyles.titleCell}>Service</TableCell>
              <TableCell
                style={serviceStyles.actionCell}
                colSpan={4}
              >
                <Tooltip title='Allows services to sleep to reduce memory consumption'>
                  <div>Sleep when not in use</div>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service, index, arr) => {
              return (
                <TableRow key={service}>
                  <TableCell style={serviceStyles.actionCell}>
                    <img
                      style={serviceStyles.avatar}
                      src={this.getServiceIconUrl(mailbox.type, service)} />
                  </TableCell>
                  <TableCell style={serviceStyles.titleCell}>
                    {this.getServiceName(mailbox.type, service)}
                  </TableCell>
                  <TableCell style={serviceStyles.actionCell}>
                    <Checkbox
                      onChange={(evt, checked) => mailboxActions.toggleServiceSleepable(mailbox.id, service, checked)}
                      checked={sleepableServicesSet.has(service)} />
                  </TableCell>
                  <TableCell style={serviceStyles.actionCell}>
                    <IconButton
                      onClick={() => mailboxActions.moveServiceUp(mailbox.id, service)}
                      disabled={index === 0}
                    >
                      <ArrowUpward />
                    </IconButton>
                  </TableCell>
                  <TableCell style={serviceStyles.actionCell}>
                    <IconButton
                      onClick={() => mailboxActions.moveServiceDown(mailbox.id, service)}
                      disabled={index === arr.length - 1}
                    >
                      <ArrowDownward />
                    </IconButton>
                  </TableCell>
                  <TableCell style={serviceStyles.actionCell}>
                    <IconButton onClick={() => mailboxActions.removeService(mailbox.id, service)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )
    } else {
      return (
        <Table>
          <TableBody>
            <TableRow>
              <TableCell style={serviceStyles.disabled}>
                All Services Disabled
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
    }
  };

  /**
  * Renders the add popover
  * @param mailbox: the mailbox
  * @param disabledServices: the list of disabled services
  * @return jsx
  */
  renderAddPopover = (mailbox, disabledServices) => {
    if (disabledServices.length) {
      const { addPopoverOpen, addPopoverAnchor } = this.state
      return (
        <div style={{ textAlign: 'right' }}>
          <Button
            onClick={(evt) => this.setState({ addPopoverOpen: true, addPopoverAnchor: evt.currentTarget })}
          >
            Add Service
          </Button>
          <Menu
            open={addPopoverOpen}
            anchorEl={addPopoverAnchor}
            onClose={() => this.setState({ addPopoverOpen: false })}
          >
            {disabledServices.map((service) => {
              return (
                <MenuItem
                  key={service}
                  onClick={() => {
                    this.setState({ addPopoverOpen: false })
                    mailboxActions.addService(mailbox.id, service)
                  }}>
                  {this.getServiceName(mailbox.type, service)}
                </MenuItem>)
            })}
          </Menu>
        </div>
      )
    } else {
      return undefined
    }
  };

  render() {
    const { mailbox, ...passProps } = this.props

    const enabledServicesSet = new Set(mailbox.enabledServies)
    const disabledServices = mailbox.supportedServices
      .filter((s) => s !== Mailbox.SERVICES.DEFAULT && !enabledServicesSet.has(s))

    return (
      <Paper style={settingStyles.paper} {...passProps}>
        <h1 style={settingStyles.subheading}>Services</h1>
        {this.renderServices(mailbox, mailbox.enabledServies, mailbox.sleepableServices)}
        {this.renderAddPopover(mailbox, disabledServices)}
        <FormControlLabel
          control={
            <Switch
              checked={mailbox.compactServicesUI}
              onChange={(evt, toggled) => mailboxActions.setCompactServicesUI(mailbox.id, toggled)}/>
          }
          label='Compact Services UI'
        />
      </Paper>
    )
  }
}
