const React = require('react')
const { mailboxWizardActions } = require('../../stores/mailboxWizard')
const { Button, Icon } = require('@material-ui/core')
const { MailOutline } = require('@material-ui/icons')
const Colors = require('@material-ui/core/colors')
const colorManipulator = require('@material-ui/core/styles/colorManipulator')
const AppTheme = require('../appTheme')

const styles = {
  icon: {
    height: 80,
    width: 80,
    display: 'inline-block',
    marginLeft: 10,
    marginRight: 10,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url("../../icons/app_512.png")'
  },
  container: {
    textAlign: 'center',
    overflow: 'auto'
  },
  heading: {
    backgroundColor: colorManipulator.lighten(AppTheme.palette.primary.main, 0.3),
    color: 'white',
    paddingTop: 40,
    paddingBottom: 20
  },
  headingTitle: {
    fontWeight: '200',
    fontSize: '30px',
    marginBottom: 0
  },
  headingSubtitle: {
    fontWeight: '200',
    fontSize: '18px'
  },
  setupItem: {
    marginTop: 32
  },
  setupItemExtended: {
    fontSize: '85%',
    color: Colors.grey['600']
  }
}

module.exports = class Welcome extends React.Component {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.heading}>
          <div style={styles.icon} />
          <h1 style={styles.headingTitle}>Welcome to openGWMail</h1>
          <h2 style={styles.headingSubtitle}>...the free and open-source desktop client for Gmail and Google Inbox</h2>
        </div>
        <div style={styles.setupItem}>
          <Button
            variant='contained'
            color='primary'
            onClick={() => mailboxWizardActions.openAddMailbox()}
          >
            <MailOutline />
            Add your first mailbox
          </Button>
          <p style={styles.setupItemExtended}>
            Get started by adding your first Gmail or Google Inbox accout
          </p>
        </div>
      </div>
    )
  }
}
