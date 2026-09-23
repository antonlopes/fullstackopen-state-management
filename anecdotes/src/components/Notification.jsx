import { useNotifications } from '../store'

const Notification = () => {
  const notification = useNotifications()


  if (notification === null) {
    return null
  }

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
  }

  return (
    <div style={style} data-testid="notification">
      {notification}
    </div>
  )
}

export default Notification
