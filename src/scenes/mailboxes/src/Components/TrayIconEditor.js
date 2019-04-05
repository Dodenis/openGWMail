const PropTypes = require('prop-types');
const React = require('react')
const { Icon } = require('@material-ui/core')
const { Slider } = require('@material-ui/lab')
const {Row, Col} = require('./Grid')
const ColorPickerButton = require('./ColorPickerButton')
const TrayPreview = require('./TrayPreview')
const settingsActions = require('../stores/settings/settingsActions')
const { withStyles } = require('@material-ui/core/styles')

const sliderStyles = {
  root: {
    padding: '22px 0px',
  },
};

const SliderStyled = withStyles(sliderStyles)(Slider)

const styles = {
  subheading: {
    marginTop: 0,
    marginBottom: 10,
    color: '#CCC',
    fontWeight: '300',
    fontSize: 16
  },
  button: {
    marginTop: 5,
    marginBottom: 5
  }
}

module.exports = class TrayIconEditor extends React.PureComponent {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    tray: PropTypes.object.isRequired,
    trayPreviewStyles: PropTypes.object
  };

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render() {
    const {tray, trayPreviewStyles, ...passProps} = this.props

    const trayRadius = {
      read: tray.readRadius,
      unread: tray.unreadRadius,
    }
    return (
      <div {...passProps}>
        <Row>
          <Col xs={6}>
            <h1 style={styles.subheading}>All Messages Read</h1>
            <div style={styles.button}>
              <ColorPickerButton
                label='Border'
                icon={<Icon className='material-icons'>border_color</Icon>}
                anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                transformOrigin={{horizontal: 'left', vertical: 'bottom'}}
                disabled={!tray.show}
                value={tray.readColor}
                onChange={(col) => settingsActions.setTrayReadColor(col.rgbaStr)} />
            </div>
            <div style={styles.button}>
              <ColorPickerButton
                label='Background'
                icon={<Icon className='material-icons'>format_color_fill</Icon>}
                anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                transformOrigin={{horizontal: 'left', vertical: 'bottom'}}
                disabled={!tray.show}
                value={tray.readBackgroundColor}
                onChange={(col) => settingsActions.setTrayReadBackgroundColor(col.rgbaStr)} />
            </div>
            <div>
                <SliderStyled
                  max={5}
                  min={0}
                  value={trayRadius.read}
                  step={1}
                  onChange={(event, value) => {
                    trayRadius.read = value
                    settingsActions.setTrayReadRadius(value)
                  }}
                  />
            </div>
            <TrayPreview size={100} style={trayPreviewStyles} config={{
              pixelRatio: 1,
              unreadCount: 0,
              showUnreadCount: tray.showUnreadCount,
              unreadColor: tray.unreadColor,
              readColor: tray.readColor,
              unreadBackgroundColor: tray.readBackgroundColor,
              readBackgroundColor: tray.readBackgroundColor,
              unreadRadius: tray.unreadRadius,
              readRadius: tray.readRadius,
              size: 100
            }} />
          </Col>
          <Col xs={6}>
            <h1 style={styles.subheading}>Unread Messages</h1>
            <div style={styles.button}>
              <ColorPickerButton
                label='Border'
                icon={<Icon className='material-icons'>border_color</Icon>}
                anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                transformOrigin={{horizontal: 'left', vertical: 'bottom'}}
                disabled={!tray.show}
                value={tray.unreadColor}
                onChange={(col) => settingsActions.setTrayUnreadColor(col.rgbaStr)} />
            </div>
            <div style={styles.button}>
              <ColorPickerButton
                label='Background'
                icon={<Icon className='material-icons'>format_color_fill</Icon>}
                anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                transformOrigin={{horizontal: 'left', vertical: 'bottom'}}
                disabled={!tray.show}
                value={tray.unreadBackgroundColor}
                onChange={(col) => settingsActions.setTrayUnreadBackgroundColor(col.rgbaStr)} />
            </div>
            <div>
              <SliderStyled
                max={5}
                min={0}
                value={trayRadius.unread}
                step={1}
                onChange={(event, value) => {
                  trayRadius.unread = value
                  settingsActions.setTrayUnreadRadius(value)
                }}
              />
            </div>
            <TrayPreview size={100} style={trayPreviewStyles} config={{
              pixelRatio: 1,
              unreadCount: 1,
              showUnreadCount: tray.showUnreadCount,
              unreadColor: tray.unreadColor,
              readColor: tray.readColor,
              unreadBackgroundColor: tray.unreadBackgroundColor,
              readBackgroundColor: tray.readBackgroundColor,
              unreadRadius: tray.unreadRadius,
              readRadius: tray.readRadius,
              size: 100
            }} />
          </Col>
        </Row>
      </div>
    )
  }
}
