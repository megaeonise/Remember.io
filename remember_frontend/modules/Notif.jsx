import { StyleSheet, Text, View } from 'react-native';
const Notif = () => {
    const [expoPushToken, setExpoPushToken] = useState("")
    const [notification, setNotification] = useState(false)
    const notificationListener = useRef()
    const responseListener = useRef()
  
    useEffect(() => {
      registerForPushNotificationsAsync().then((token) =>
        setExpoPushToken(token)
      )
  
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        })
  
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
        })

      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        )
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    }, [])
  
    return (
     <Text>test</Text>
    )
  }

  export default Notif
  