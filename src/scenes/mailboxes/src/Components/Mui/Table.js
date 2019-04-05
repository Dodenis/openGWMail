const React = require('react')
const { Table: MuiTable } = require('@material-ui/core')
const { withStyles } = require('@material-ui/core/styles')

const styles = theme => ({
  root: {
    borderCollapse: 'initial'
  }
})

class Table extends React.Component {
  render () {
    const {classes, ...other} = this.props

    return (
      <MuiTable
        classes={{
          root: classes.root
        }}
        {...other}
      />
    )
  }
}

module.exports = withStyles(styles)(Table)
