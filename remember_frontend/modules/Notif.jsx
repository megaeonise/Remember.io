import React, { useEffect, useState } from 'react';
import { Keyboard, TextInput, View, Button } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const onSubmit = (seconds) => {
  Keyboard.dismiss();
  console.log('test',seconds)
  const schedulingOptions = {
    content: {
      title: 'it FUCKING WORKS',
      body: 'This is the body',
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      color: "cyan"
    },
    trigger: {
      seconds: seconds,
    },
  };
  // Notifications show only when app is not active.
  // (ie. another app being used or device's screen is locked)
  Notifications.scheduleNotificationAsync(
    schedulingOptions,
  );
};
const handleNotification = () => {
  console.warn('ok! got your notif');
};

const askNotification = async () => {
  // We need to ask for Notification permissions for ios devices
  const { status } = await await Notifications.requestPermissionsAsync();
  if (Constants.isDevice && status === 'granted')
    console.log('Notification permissions granted.');
};

const Notif = () => {
  const [text, onChangeText] = useState("");

  useEffect(() => {
    askNotification();
    // If we want to do something with the notification when the app
    // is active, we need to listen to notification events and
    // handle them in a callback
    const listener = Notifications.addNotificationReceivedListener(handleNotification);
    return () => listener.remove();
  }, []);

  return (
  <View>
    <TextInput
        onChangeText={onChangeText}
        value={text}
        placeholder="Seconds"
        style={{fontSize: 30, borderWidth: 1, width: 300}}
        keyboardType="numeric"
    />
    <Button onPress={() => onSubmit(Number(text))} title="Schedule"/>
  </View>)
};

export default Notif

