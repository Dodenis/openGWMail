module.exports = {
  /* **************************************************************************/
  // Modal
  /* **************************************************************************/
  dialog: {
    width: '90%',
    maxWidth: 1200
  },
  tabToggles: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'stretch'
  },
  tabToggle: {
    height: 50,
    borderRadius: 0,
    flex: 1,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid'
  },

  /* **************************************************************************/
  // General
  /* **************************************************************************/
  paper: {
    padding: 15,
    marginBottom: 5,
    marginTop: 5,
    overflow: 'hidden'
  },
  subheading: {
    marginTop: 0,
    marginBottom: 10,
    color: '#CCC',
    fontWeight: '300',
    fontSize: 16
  },
  fileInputButton: {
    marginRight: 15,
    position: 'relative',
    overflow: 'hidden'
  },
  fileInput: {
    display: 'none'
  },
  button: {
    marginTop: 5,
    marginBottom: 5
  },

  /* **************************************************************************/
  // Account
  /* **************************************************************************/

  accountPicker: {
    margin: '10px 0',
    display: 'flex',
    flexDirection: 'row'
  },
  accountPickerAvatar: {
    backgroundColor: 'white',
    width: 80,
    height: 80,
    boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px' // copied from paper
  },
  accountPickerContainer: {
    flexGrow: 1,
    paddingLeft: 10
  }
}
