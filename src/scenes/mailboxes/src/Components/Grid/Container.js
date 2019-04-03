import 'bootstrap-grid'

const PropTypes = require('prop-types');

const React = require('react')

module.exports = class GridContainer extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    fluid: PropTypes.bool
  };

  render() {
    const {fluid, className, ...passProps} = this.props

    const classNames = [
      fluid ? 'container-fluid' : 'conainer',
      className
    ].filter((c) => !!c).join(' ')

    return (
      <div {...passProps} className={classNames}>
        {this.props.children}
      </div>
    )
  }
}
