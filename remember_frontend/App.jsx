import { useState } from "react"
import "./App.css"
import { Text, View } from "react-native"
import * as Notifications from "expo-notifications"


const App = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlayAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false
    })
  }) 

  Notifications.scheduleNotificationAsync({
    content: {
      title: 'Look at that notification',
      body: "I'm so proud of myself!",
    },
    trigger: { seconds: 5, repeats: true },
  });
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
    <View className = {color}>
    <div>
      <button onClick = {colorChanger} >
        <Text className = {color}>Good</Text>
      </button>
    </div>
    </View>
  )
}
export default App