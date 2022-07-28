import PropTypes from 'prop-types'

const Notification = ({ message, color }) => {
  if (message === null) {
    return null
  }

  const notificationStyle = {
    color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }
  return (
    <div style={notificationStyle} className="notification">
      {message}
    </div>
  )
}

Notification.propTypes = {
  // eslint-disable-next-line no-unused-vars
  message: function (props, propName, componentName) {
    if (typeof props[propName] !== 'string' && props[propName] !== null) {
      return new Error('Invalid message type in Notification')
    }
  },
  color: PropTypes.string,
}

export default Notification
