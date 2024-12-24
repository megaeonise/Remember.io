import { useState } from "react"
import "./App.css"
import Notif from './modules/Notif'
import Video from './modules/Video'
import ImageView from "./modules/Image"
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context"
import * as Device from "expo-device"
import Constants from "expo-constants"




const ModuleTest = () => {
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
    <SafeAreaProvider>
    <SafeAreaView style={styles.container} edges={['top']}>
    <ScrollView style={styles.scrollView}>
      <Text style={styles.text}>help app!
      </Text>
      <StatusBar style="auto" />
      <Notif />
      <ImageView />
      <Video />
    </ScrollView>
    </SafeAreaView>
    </SafeAreaProvider>
  )
}
export default ModuleTest


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'cyan',
  },
  text: {
    fontSize: 42,
    padding: 12,
  },
});