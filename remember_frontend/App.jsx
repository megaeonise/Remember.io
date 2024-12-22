import { useState } from "react"
import "./App.css"
import Notif from './modules/Notif'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


const App = () => {
  const [color, setColor] = useState('red')
  const [colorcount, setcolorCount] = useState(0)
  const colorArray = ['blue', 'green', 'red']

  const colorChanger = () => {
    console.log(colorcount)
    console.log('color change requested')
    setColor(colorArray[colorcount])
    setcolorCount(colorcount+1)
    if (colorcount >= 2) setcolorCount(0)
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <Notif />
    </View>
  )
}
export default App


