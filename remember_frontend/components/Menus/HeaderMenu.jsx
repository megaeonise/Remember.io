import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PreferencesContext } from '../../context/preferencesContext';

const HeaderMenu = ({ navigation }) => {
  const { state, setState } = useContext(AuthContext);
  const { preferences } = useContext(PreferencesContext);

  const logout = async () => {
    console.log("Logout button pressed");
    try {
      await AsyncStorage.removeItem('@auth');
      setState({ user: null, token: '' });
      // The state change will trigger ScreenMenu to show the Login screen
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Text style={[styles.title, { fontFamily: preferences.fontFamily }]}>Home</Text>
      </View>
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={logout}
      >
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderMenu;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    width: '100%',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});