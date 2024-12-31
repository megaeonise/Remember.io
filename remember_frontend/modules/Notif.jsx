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
  const { state } = useContext(AuthContext);

  return (
    <>
    <TextInput />
    <Button onPress={NotifCaller} title="test"/>
    </>
  )
}
export default Notif