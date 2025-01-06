import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    backgroundColor: '#ffffff',
    fontSize: 16,
    fontFamily: 'Arial',
    windowColor: '#1BBAC8',  
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    console.log('PreferencesContext: Saving preferences:', preferences);
    savePreferences();
  }, [preferences]);

  const loadPreferences = async () => {
    try {
      const savedPreferences = await AsyncStorage.getItem('@preferences');
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        console.log('PreferencesContext: Loaded preferences:', parsed);
        setPreferences(parsed);
      }
    } catch (error) {
      console.error('PreferencesContext: Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    try {
      await AsyncStorage.setItem('@preferences', JSON.stringify(preferences));
      console.log('PreferencesContext: Preferences saved successfully');
    } catch (error) {
      console.error('PreferencesContext: Error saving preferences:', error);
    }
  };

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};