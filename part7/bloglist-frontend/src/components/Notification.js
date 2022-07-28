import { useSelector } from 'react-redux'

const Notification = () => {
  const { message, color } = useSelector((state) => state.notification)

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

export default Notification
