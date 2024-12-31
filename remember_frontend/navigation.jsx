
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { AuthProvider } from './context/authContext';
import { PreferencesProvider } from './context/preferencesContext';
import ScreenMenu from './components/Menus/ScreenMenu';

const RootNavigation = () => {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <ScreenMenu />
      </PreferencesProvider>
    </AuthProvider>
  );
};

export default RootNavigation;

const styles = StyleSheet.create({});