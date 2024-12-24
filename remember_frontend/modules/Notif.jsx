import * as Notifications from 'expo-notifications'
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

// First, set the handler that will cause the notification
// to show the alert
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Second, call scheduleNotificationAsync()


const NotifCaller = () => {
  console.log('test')
  Notifications.scheduleNotificationAsync({
    content: {
      title: 'Look at that notification',
      body: "IF I SEE MY CYAN NOTIFICATION",
    },
    trigger: null,
  });
}
const Notif = () => {
  return (
    <>
    <TextInput />
    <Button onPress={NotifCaller} title="test"/>
    </>
  )
}
export default Notif