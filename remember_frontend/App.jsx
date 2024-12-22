import { useState } from "react"
import "./App.css"
import Notif from './modules/Notif'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import * as Device from "expo-device"
import Constants from "expo-constants"




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
      <Text>help app!</Text>
      <StatusBar style="auto" />
      <Notif />
    </View>
  )
}
export default App


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})