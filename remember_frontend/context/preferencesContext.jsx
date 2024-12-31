import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    backgroundColor: '#ffffff',
    fontSize: 16,
    fontFamily: 'Arial', // 
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    savePreferences();
  }, [preferences]);

  const loadPreferences = async () => {
    try {
      const savedPreferences = await AsyncStorage.getItem('@preferences');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    try {
      await AsyncStorage.setItem('@preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};