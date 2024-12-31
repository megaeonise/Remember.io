
import { useState, useContext } from "react";
import "./App.css";
import Notif from './modules/Notif';
import Video from './modules/Video';
import ImageView from "./modules/Image";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { PreferencesContext } from './context/preferencesContext';

const ModuleTest = () => {
  const { preferences } = useContext(PreferencesContext);
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
          <Text style={[styles.text, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Home Page + API testing</Text>
          <StatusBar style="auto" />
          <Notif />
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
});