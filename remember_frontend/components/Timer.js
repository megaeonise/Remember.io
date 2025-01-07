import React, { useState, useEffect, useContext } from "react";
import { Button, Image, View, StyleSheet, TextInput, Text, ScrollView, TouchableOpacity } from "react-native"
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context"
import { PreferencesContext } from '../context/preferencesContext';
import SetTime from "../screens/SetTime";


const Timer = () => {
  const { preferences } = useContext(PreferencesContext);
  const [isPomodoro, setIsPomodoro] = useState(true);
  const [timeLeft, setTimeLeft] = useState(isPomodoro ? 25 * 60 : 30 * 60);
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
      <SafeAreaView style={[styles.container, { backgroundColor: preferences.backgroundColor }]} edges={['top']}>
        <ScrollView style={[styles.scrollView, { backgroundColor: preferences.backgroundColor }]}>
          <Text style={[
            styles.title,
            { 
              fontSize: preferences.fontSize + 4,
              fontFamily: preferences.fontFamily
            }
          ]}>
            {isPomodoro ? "Pomodoro Timer" : "Regular Timer"}
          </Text>
          
          <Text style={[
            styles.timerText,
            { 
              fontSize: preferences.fontSize + 20,
              fontFamily: preferences.fontFamily
            }
          ]}>
            {`${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? "0" : ""}${timeLeft % 60}`}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: isRunning ? '#ff4444' : (preferences.windowColor || '#1BBAC8') }]}
              onPress={toggleTimer}
            >
              <Text style={[
                styles.buttonText,
                { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }
              ]}>
                {isRunning ? "Pause" : "Start"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: preferences.windowColor || '#666' }]}
              onPress={resetTimer}
            >
              <Text style={[
                styles.buttonText,
                { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }
              ]}>
                Reset
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: preferences.windowColor || '#1BBAC8' }]}
              onPress={switchTimerMode}
            >
              <Text style={[
                styles.buttonText,
                { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }
              ]}>
                {isPomodoro ? "Switch to Regular" : "Switch to Pomodoro"}
              </Text>
              <SetTime />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>

  );
};

export default Timer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  timerText: {
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: 'bold',
  },
  buttonContainer: {
    gap: 10,
    alignItems: 'center',
  },
  button: {
    padding: 15,
    borderRadius: 5,
    minWidth: 200,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#666',
  },
  switchButton: {
    backgroundColor: '#1BBAC8',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});