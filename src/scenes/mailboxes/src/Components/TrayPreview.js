const PropTypes = require('prop-types');
const React = require('react')
const TrayRenderer = require('./TrayRenderer')

module.exports = class TrayPreview extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    config: PropTypes.object.isRequired,
    size: PropTypes.number.isRequired
  };

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  state = { image: null };

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentWillMount() {
    TrayRenderer.renderPNGDataImage(this.props.config)
      .then((png) => this.setState({ image: png }))
  }

  componentWillReceiveProps(nextProps) {
    TrayRenderer.renderPNGDataImage(nextProps.config)
      .then((png) => this.setState({ image: png }))
  }

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { size, style, ...passProps } = this.props
    delete passProps.config

    return (
      <div {...passProps} style={Object.assign({
        width: size,
        height: size,
        backgroundImage: 'linear-gradient(45deg, #CCC 25%, transparent 25%, transparent 75%, #CCC 75%, #CCC), linear-gradient(45deg, #CCC 25%, transparent 25%, transparent 75%, #CCC 75%, #CCC)',
        backgroundSize: '30px 30px',
        backgroundPosition: '0 0, 15px 15px',
        boxShadow: 'inset 0px 0px 10px 0px rgba(0,0,0,0.75)'
      }, style)}>
        {!this.state.image ? undefined : (
          <img
            src={this.state.image}
            width={size + 'px'}
            height={size + 'px'} />
        )}
      </div>
    )
  }
}
