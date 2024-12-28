import { StyleSheet, View, Button, Alert } from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HeaderMenu = () => {
  const { state, setState } = useContext(AuthContext);

  const logout = async () => {
    console.log("Logout button pressed");
    try {
      await AsyncStorage.removeItem('@auth');
      setState({ user: null, token: '' });
      Alert.alert("Success", "Logged out successfully");
    } catch (error) {
      console.log("Logout error:", error);
      Alert.alert("Error", "Failed to logout");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={logout} color="red" />
    </View>
  );
};

export default HeaderMenu;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    padding: 10,
  },
});