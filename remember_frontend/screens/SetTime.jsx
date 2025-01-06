import React, { useState, useEffect, useContext } from "react";
import { Button, Alert, Image, View, StyleSheet, TextInput, Text, ScrollView } from "react-native"
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context"
import { AuthContext } from '../context/authContext';
import { PreferencesContext } from '../context/preferencesContext';
import axios from 'axios';
import Notif from "../modules/Notif";



const SetTime = ({navigation}) => {
    const [leaveTime, onChangeleaveTime] = useState('') 
    const { state } = useContext(AuthContext);
    const { preferences } = useContext(PreferencesContext);
    const [success, setSuccess] = useState(null)
    const [id, setId] = useState('')
    
    const now = new Date();
    const notifDate = new Date()
    let notifTitle = null
    let notifBody = null
    let notifTrigger = null
    notifDate.setHours(leaveTime[0]+leaveTime[1], leaveTime[3]+leaveTime[4], 0, 0)
    if (notifDate <= now) {
      notifDate.setDate(notifDate.getDate() + 1);
    }

    console.log(notifTrigger, 'WHYHRSUGFHDR')
    useEffect(() => {
      getTime()
      console.log(leaveTime, 'this is the time')
      if(leaveTime!==''){
        setSuccess(false)
        console.log('it coulfd work')
      }
      else{
        setSuccess(true)
      }
      console.log(success, 'success')
    }, [])

    const getTime = async () => {
      console.log('getting time')
      try {
        console.log(`/leaveTime/${state.user._id}`)
        const response = await axios.get(`/leaveTime/${state.user._id}`);
        if (response.data.success) {
          let test = response.data.user_leaveTime[0]._id
          console.log(test, 'this is my id tnenene nen en')
          onChangeleaveTime(response.data.user_leaveTime[0].time)
          setId(test)
        } else {
          Alert.alert('Failed to load time');
        }
      } catch (error) {
        console.error('Error loading time:', error);
        Alert.alert('Error', 'Failed to load time. Please try again.');
      }
    };
    const saveTime = async () => {
        console.log(success)
        if (!leaveTime) {
        Alert.alert('Please set a time');
        return;
        }
        else{
          if(!success){
          const newTime = { userId: state.user._id, time: leaveTime };
          console.log(newTime, 'why u have bigpoy')
          try {
            const response = await axios.post('/leaveTime/save', newTime);
            if (response.data.success) {
              Alert.alert('Time saved successfully');
            } else {
              Alert.alert('Failed to save time');
            }
          } catch (error) {
            console.error('Error saving time:', error);
            Alert.alert('Error', 'Failed to save time. Please try again.');
          }
        } else {
          const newTime = { userId: state.user._id, time: leaveTime, _id: id };
          console.log(newTime, 'why u have SMALLpoy', id)
          try {
            const response = await axios.put(`/leaveTime/${state.user._id}`, newTime);
            console.log(response.status)
            if (response.status===204) {
              Alert.alert('Time updated successfully');
            } else {
              Alert.alert('Failed to updated time');
            }
          } catch (error) {
            console.error('Error updating time:', error);
            Alert.alert('Error', 'Failed to update time. Please try again.');
          }

        }
        }
        }
    
    console.log(notifTrigger)
    if (notifDate.getHours() === now.getHours()-1 || notifDate.getHours() === now.getHours()) {
      console.log(now, 'its the current time, does this match?')
      console.log(notifDate.getHours(),now.getHours())
      notifTitle = "Time to leave"
      notifBody = "It is your scheduled time to leave"
      return (
        <SafeAreaProvider>
          <SafeAreaView style={[styles.container, { backgroundColor: preferences.backgroundColor }]} edges={['top']}>
            <ScrollView style={[styles.scrollView, { backgroundColor: preferences.backgroundColor }]}>
              <StatusBar style="auto" />
              <Text style={[styles.text, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>
                Input the time you will depart below. You will be notified at that time. Enter as 24 Hour Clock time.</Text>
              <TextInput 
                style={styles.input}
                onChangeText={onChangeleaveTime}
                value={leaveTime}
              />
              <Notif title={notifTitle} body={notifBody} trigger={notifTrigger} />
              <Button title="Update Time" onPress={saveTime}/>
            </ScrollView>
          </SafeAreaView>
        </SafeAreaProvider>
      );
    } else {
      return (
        <SafeAreaProvider>
          <SafeAreaView style={[styles.container, { backgroundColor: preferences.backgroundColor }]} edges={['top']}>
            <ScrollView style={[styles.scrollView, { backgroundColor: preferences.backgroundColor }]}>
              <StatusBar style="auto" />
              <Text style={[styles.text, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>
                Input the time you will depart below. You will be notified at that time. Enter as 24 Hour Clock time.</Text>
              <TextInput 
                style={styles.input}
                onChangeText={onChangeleaveTime}
                value={leaveTime}
              />
              <Button title="Update Time" onPress={saveTime}/>
            </ScrollView>
          </SafeAreaView>
        </SafeAreaProvider>
      );
    }

    
    
}

export default SetTime

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
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },

  });