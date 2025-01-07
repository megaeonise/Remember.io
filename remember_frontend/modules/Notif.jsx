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
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Second, call scheduleNotificationAsync()


//this posts one and two





const Notif = (props) => {
  const { state } = useContext(AuthContext);
  console.log(props, 'next is strigger', props.trigger)
  Notifications.scheduleNotificationAsync({
    content: {
      title: props.title,
      body: props.body,
    },
    trigger: props.trigger, //change to props.trigger
  });
  const NotifCaller = () => {
    
  }

  return (
    <>
    <Text>IOm jiumbo</Text>
    </>
  )
}
export default Notif