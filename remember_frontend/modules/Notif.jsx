import * as Notifications from 'expo-notifications'
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { useContext, useState } from 'react'
import { AuthContext } from '../context/authContext'

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


//this posts one and two
const PostTemp = async () => {
  console.log('tst')
  const { state } = useContext(AuthContext)
  console.log('test')
  const one = Math.floor(Math.random()*100)
  const two = Math.floor(Math.random()*100)
  const newTemp = { userId: state.user_id, first: {one}, second: {two} }
  console.log(one, two)
  try {
    const response = await axios.post('/routes/one', newTemp)
    if (response.data.success) {
      Alert.alert('One sent')
    } else {
      Alert.alert('Failed to send one')
    }
  }
  catch (error) {
    console.error('Error with one:', error)
    Alert.alert("Error", "One was not posted")
  }
  try {
    const response = await axios.post('/routes/two', newTemp)
    if (response.data.success) {
      Alert.alert('Two sent')
    } else {
      Alert.alert('Failed to send two')
    }
  }
  catch (error) {
    console.error('Error with two:', error)
    Alert.alert("Error", "Two was not posted")
  }
}

const GetTemp = async () => {
  try {
    const response = await axios.get('/routes/one');
    if (response.data.success) {
      console.log(response.data.ones, 'One is here');
    } else {
      Alert.alert('Failed to load one');
    }
  } catch (error) {
    console.error('Error loading one:', error);
    Alert.alert('Error', 'Failed to load one. Please try again.');
  }
  try {
    const response = await axios.get('/routes/two');
    if (response.data.success) {
      console.log(response.data.twos, 'Two is here');
    } else {
      Alert.alert('Failed to load Two');
    }
  } catch (error) {
    console.error('Error loading two:', error);
    Alert.alert('Error', 'Failed to load two. Please try again.');
  }
};

const NotifCaller = () => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: 'Test Notifcation',
      body: "Comes when button pressed",
    },
    trigger: null,
  });
}
const Notif = () => {
  return (
    <>
    <TextInput />
    <Button onPress={NotifCaller} title="test"/>
    <Button onPress={PostTemp} title="post"/>
    <Button onPress={GetTemp} title="get"/>
    </>
  )
}
export default Notif