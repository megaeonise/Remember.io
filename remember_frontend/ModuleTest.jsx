import { useState, useContext } from "react";
import "./App.css";
import Notif from './modules/Notif';
import Video from './modules/Video';
import ImageView from "./modules/Image";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, TextInput } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { PreferencesContext } from './context/preferencesContext';
import * as Device from "expo-device"
import Constants from "expo-constants"
import ImageUpload from "./modules/ImageUpload"

const ModuleTest = () => {
  const { preferences } = useContext(PreferencesContext);
  const [test, setTest] = useState('')
  const trigger = null
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
          <Text style={[styles.text, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Home Page + API testing</Text>
          <StatusBar style="auto" />
          <TextInput onChangeText={setTest}/>
          <Notif title={test} body={test} trigger={trigger}/>
           <Image 
      style= {styles.tinylogo}
      source={{
          uri: 'https://reactnative.dev/img/tiny_logo.png',
        }}
        alt="it doesnt load"/>
          <ImageView />
          <ImageUpload />
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