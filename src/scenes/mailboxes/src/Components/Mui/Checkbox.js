const React = require('react')
const { Checkbox: MuiCheckbox } = require('@material-ui/core')

class Checkbox extends React.Component {
  render () {
    const {...other} = this.props

    return (
      <MuiCheckbox
        {...other}
      />
    )
  }
}

Checkbox.defaultProps = {
  color: 'primary'
}

module.exports = Checkbox
