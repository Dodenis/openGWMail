const PropTypes = require('prop-types');
const React = require('react')
const { Button, Dialog, TextField, DialogTitle, DialogActions, DialogContent } = require('@material-ui/core')
const uuid = require('uuid')

module.exports = class CustomCodeEditingModal extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    title: PropTypes.string,
    open: PropTypes.bool.isRequired,
    code: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  state = {
    editingKey: uuid.v4()
  };

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open) {
      this.setState({ editingKey: uuid.v4() })
    }
  }

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const actions = [
      (<Button
        key='cancel'
        style={{ marginRight: 8 }}
        onClick={(evt) => this.props.onCancel(evt)}
      >
        Cancel
      </Button>),
      (<Button
        variant='contained'
        key='save'
        color="primary"
        onClick={(evt) => this.props.onSave(evt, this.refs.editor.getValue())}
      >
        Save
      </Button>)
    ]

    return (
      <Dialog
        open={this.props.open}
      >
        <DialogTitle>
          {this.props.title}
        </DialogTitle>
        <DialogContent>
          <TextField
            key={this.state.editingKey}
            ref='editor'
            name='editor'
            multiLine
            defaultValue={this.props.code}
            rows={10}
            rowsMax={10}
            textareaStyle={{
              margin: 0,
              fontFamily: 'monospace',
              fontSize: '12px',
              lineHeight: '14px',
              border: '1px solid rgb(224, 224, 224)',
              borderRadius: 3
            }}
            underlineShow={false}
            fullWidth />
        </DialogContent>
        <DialogActions>
          {actions}
        </DialogActions>
      </Dialog>
    )
  }
}
