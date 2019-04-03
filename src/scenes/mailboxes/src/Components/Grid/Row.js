import 'bootstrap-grid'

const PropTypes = require('prop-types');

const React = require('react')

module.exports = class GridRow extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    return (
      <div
        {...this.props}
        className={['row', this.props.className].filter((c) => !!c).join(' ')}>
        {this.props.children}
      </div>
    )
  }
}
