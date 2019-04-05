const PropTypes = require('prop-types')
const React = require('react')
const { Button, Popover } = require('@material-ui/core')
const { ChromePicker } = require('react-color')

module.exports = class ColorPickerButton extends React.Component {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    value: PropTypes.string,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    anchorOrigin: PropTypes.object.isRequired,
    transformOrigin: PropTypes.object.isRequired,
    icon: PropTypes.node,
    onChange: PropTypes.func
  };

  static defaultProps = {
    label: 'Pick Colour',
    disabled: false,
    anchorOrigin: {horizontal: 'left', vertical: 'bottom'},
    transformOrigin: {horizontal: 'left', vertical: 'top'}
  };

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  state = {
    open: false,
    anchor: null
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { label, disabled, onChange, anchorOrigin, transformOrigin, icon, ...passProps } = this.props
    return (
      <div {...passProps}>
        <Button
          variant='contained'
          disabled={disabled}
          onClick={(evt) => this.setState({ open: true, anchor: evt.target })}
          fullWidth
        >
          {icon}
          {label}
        </Button>
        <Popover
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          anchorEl={this.state.anchor}
          open={this.state.open}
          onClose={() => this.setState({open: false})}>
          <ChromePicker
            color={this.props.value}
            onChangeComplete={(col) => {
              if (onChange) {
                onChange(Object.assign({}, col, {
                  rgbaStr: `rgba(${col.rgb.r}, ${col.rgb.g}, ${col.rgb.b}, ${col.rgb.a})`
                }))
              }
            }} />
        </Popover>
      </div>
    )
  }
}
