import { useState, useContext, useEffect } from "react";
import "./App.css";
import Notif from './modules/Notif';
import Video from './modules/Video';
import ImageView from "./modules/Image";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, TextInput, Button } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { AuthContext } from './context/authContext';
import { PreferencesContext } from './context/preferencesContext';
import { AuthContext } from './context/authContext';
import * as Device from "expo-device"
import Constants from "expo-constants"
import ImageUpload from "./modules/ImageUpload"
import axios from 'axios';
import Alarm from "./modules/Alarm";


const ModuleTest = () => {
  const { preferences } = useContext(PreferencesContext);
  const { state } = useContext(AuthContext);
  const [test, setTest] = useState('')
  const [notifTime, setNotifTime] = useState('')
  const trigger = null
  const now = new Date();
  const notifDate = new Date()
  let notifTitle = null
  let notifBody = null
  let notifTrigger = null
  notifDate.setHours(notifTime[0]+notifTime[1], notifTime[3]+notifTime[4], 0, 0)
  if (notifDate <= now) {
    notifDate.setDate(notifDate.getDate() + 1);
  }


  useEffect(() => {
    getTime()
    console.log(notifDate.getHours()-2)
    handleScheduleAlarm(notifDate.getHours()-2, notifDate.getMinutes())
    console.log(notifTime, 'this is the time')
  }, [])

  const getTime = async () => {
    console.log('getting time')
    try {
      console.log(`/leaveTime/${state.user._id}`)
      const response = await axios.get(`/leaveTime/${state.user._id}`);
      if (response.data.success) {
        console.log(response.data.user_leaveTime[0].time, 'this is my id tnenene nen en')
        setNotifTime(response.data.user_leaveTime[0].time)
      } else {
        Alert.alert('Failed to load time');
      }
    } catch (error) {
      console.error('Error loading time:', error);
      Alert.alert('Error', 'Failed to load time. Please try again.');
    }
  };

  const handleScheduleAlarm = async (hour, minute) => {
    const result = await Alarm.scheduleAlarm(hour, minute); 
    if (result.success) {
      console.log('alarm set')
    } else {
      Alert.alert('Error', `Failed to set alarm: ${result.error}`);
    }
  };
  if (notifDate.getHours() === now.getHours()-1 || notifDate.getHours() === now.getHours()) {
        console.log(now, 'its the current time, does this match?')
        console.log(notifDate.getHours(),now.getHours())
        notifTitle = "Check your route"
        notifBody = "Check your route before leaving"
  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: preferences.backgroundColor }]} edges={['top']}>
        <ScrollView style={[styles.scrollView, { backgroundColor: preferences.backgroundColor }]}>
    
          <Text style={[styles.text, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Hello {state?.user?.name || 'Guest'}!</Text>
          <StatusBar style="auto" />
          <TextInput onChangeText={setTest}/>
          <Notif title={notifTitle} body={notifBody} trigger={notifTrigger}/>
           <Image 
            style={styles.tinylogo}
            source={{
              uri: 'https://reactnative.dev/img/tiny_logo.png',
            }}
            alt="it doesnt load"
          />
          <ImageView />
          <ImageUpload />
          <Video />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}else{
  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: preferences.backgroundColor }]} edges={['top']}>
        <ScrollView style={[styles.scrollView, { backgroundColor: preferences.backgroundColor }]}>
          <Text style={[styles.text, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Home Page + API testing</Text>
          <StatusBar style="auto" />
          <TextInput onChangeText={setTest}/>
            <Button title="Im scheduling alarm" onPress={handleScheduleAlarm} />
          <ImageView />
          <ImageUpload />
          <Video />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
)}
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