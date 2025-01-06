import React, { useState, useEffect, useContext } from "react";
import { Button, Alert, Image, View, StyleSheet, TextInput, Text, ScrollView } from "react-native"
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context"
import { AuthContext } from '../context/authContext';
import { PreferencesContext } from '../context/preferencesContext';
import axios from 'axios';



const SetTime = ({navigation}) => {
    const [leaveTime, onChangeleaveTime] = useState(null) 
    const { state } = useContext(AuthContext);
    const { preferences } = useContext(PreferencesContext);
    const saveTime = async () => {
        console.log('?')
        if (!leaveTime) {
        Alert.alert('Please set a time');
        return;
        }
        else{
          const newTime = { userId: state.user._id, time: leaveTime };
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
        }
        }
      
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