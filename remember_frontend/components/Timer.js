import React, { useState, useEffect, useContext } from "react";
import { Button, Image, View, StyleSheet, TextInput, Text, ScrollView } from "react-native"
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context"
import SetTime from "../screens/SetTime";

const Timer = () => {
  const [isPomodoro, setIsPomodoro] = useState(true); // Pomodoro or regular timer
  const [timeLeft, setTimeLeft] = useState(isPomodoro ? 25 * 60 : 30 * 60); // Default to Pomodoro (25 mins)
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      alert("Time's up!");
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(isPomodoro ? 25 * 60 : 30 * 60);
    setIsRunning(false);
  };

  const switchTimerMode = () => {
    setIsPomodoro(!isPomodoro);
    setTimeLeft(isPomodoro ? 30 * 60 : 25 * 60);
    setIsRunning(false);
  };

  return (
  <SafeAreaProvider>
  <SafeAreaView style={styles.container} edges={['top']}>
  <ScrollView style={styles.scrollView}>
  <Text style={styles.text}>{isPomodoro ? "Pomodoro Timer" : "Regular Timer"}</Text>
      <Text style={styles.text}>{`${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? "0" : ""}${
        timeLeft % 60
      }`}</Text>
      <Button onPress={toggleTimer} title={isRunning ? "Pause" : "Start"}/>
      <Button onPress={resetTimer} title='Reset'/>
      <Button onPress={switchTimerMode} title={isPomodoro ? "Switch to Regular" : "Switch to Pomodoro"} />
      <SetTime />
  </ScrollView>
  </SafeAreaView>
  </SafeAreaProvider>
  );
};

export default Timer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'cyan',
  },
  text: {
    fontSize: 30,
    padding: 12,
    paddingTop: StatusBar.currentHeight,
    paddingLeft: 100
  },
  tinylogo: {
    width: 50,
    height: 50
  }
});