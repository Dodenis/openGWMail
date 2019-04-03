const PropTypes = require('prop-types');
const React = require('react')
const { Paper } = require('@material-ui/core')

module.exports = class MailboxTargetUrl extends React.Component {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    url: PropTypes.string
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const { url, ...passProps } = this.props

    const className = [
      'ReactComponent-MailboxTargetUrl',
      url ? 'active' : undefined
    ].concat(this.props.className).filter((c) => !!c).join(' ')
    return (
      <Paper {...passProps} className={className}>
        {url}
      </Paper>
    )
  }
}
