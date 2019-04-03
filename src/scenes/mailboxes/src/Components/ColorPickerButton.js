const PropTypes = require('prop-types')
const React = require('react')
const { RaisedButton, Popover } = require('material-ui')
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
    targetOrigin: PropTypes.object.isRequired,
    icon: PropTypes.node,
    onChange: PropTypes.func
  };

  static defaultProps = {
    label: 'Pick Colour',
    disabled: false,
    anchorOrigin: {horizontal: 'left', vertical: 'bottom'},
    targetOrigin: {horizontal: 'left', vertical: 'top'}
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
    const { label, disabled, onChange, anchorOrigin, targetOrigin, icon, ...passProps } = this.props
    return (
      <div {...passProps}>
        <RaisedButton
          icon={icon}
          label={label}
          disabled={disabled}
          onClick={(evt) => this.setState({ open: true, anchor: evt.target })} />
        <Popover
          anchorOrigin={anchorOrigin}
          targetOrigin={targetOrigin}
          anchorEl={this.state.anchor}
          open={this.state.open}
          onRequestClose={() => this.setState({open: false})}>
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
