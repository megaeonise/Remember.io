import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HeaderMenu = ({}) => {
  const { state, setState } = useContext(AuthContext);

  const logout = async () => {
    console.log("Logout button pressed");
    await AsyncStorage.removeItem('@auth');
    setState({ user: null, token: '' });
    Alert.alert("Logged out successfully");
    
    
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={logout}>
        <FontAwesome5 name={'sign-out-alt'} size={20} color={'red'} style={styles.iconStyle} />
      </TouchableOpacity>
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
  iconStyle: {
    marginBottom: 5,
  },
});