import { useState, useContext } from "react";
import "./App.css";
import Notif from './modules/Notif';
import Video from './modules/Video';
import ImageView from "./modules/Image";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { PreferencesContext } from './context/preferencesContext';
import { AuthContext } from './context/authContext';
import * as Device from "expo-device"
import Constants from "expo-constants"
import ImageUpload from "./modules/ImageUpload"

const ModuleTest = () => {
  const { preferences } = useContext(PreferencesContext);
  const { state } = useContext(AuthContext);
  const [color, setColor] = useState('red');
  const [colorcount, setcolorCount] = useState(0);
  const colorArray = ['blue', 'green', 'red'];

  const colorChanger = () => {
    console.log(colorcount);
    console.log('color change requested');
    setColor(colorArray[colorcount]);
    setcolorCount(colorcount + 1);
    if (colorcount >= 2) setcolorCount(0);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: preferences.backgroundColor }]} edges={['top']}>
        <ScrollView style={[styles.scrollView, { backgroundColor: preferences.backgroundColor }]}>
    
          <Text style={[styles.text, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Hello {state?.user?.name || 'Guest'}!</Text>
          <StatusBar style="auto" />
          <Notif />
           <Image 
            style={styles.tinylogo}
            source={{
              uri: 'https://reactnative.dev/img/tiny_logo.png',
            }}
            alt="it doesnt load"
          />
          <ImageView />
          <Video />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ModuleTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    // Removed the hardcoded background color
  },
  text: {
    padding: 12,
  },
  tinylogo: {
    width: 50,
    height: 50
  }
});