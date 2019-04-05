const React = require('react')
const { FormControl } = require('@material-ui/core')

class FormControlFullWidth extends React.Component {
  render () {
    const {...other} = this.props

    return (
      <FormControl
        {...other}
      />
    )
  }
}

FormControlFullWidth.defaultProps = {
  fullWidth: true,
  margin: 'normal'
}

module.exports = FormControlFullWidth
