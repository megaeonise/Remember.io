import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../../screens/auth/Login';
import Register from '../../screens/auth/Register';
import Home from '../../screens/Home';
import MapScreen from '../../screens/MapScreen';
import Settings from '../../screens/Settings'; // Import the Settings component
import { AuthContext } from '../../context/authContext';
import HeaderMenu from './HeaderMenu';

const ScreenMenu = () => {
  const { state } = useContext(AuthContext);
  const authenticatedUser = state?.user && state?.token;
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName={authenticatedUser ? 'Home' : 'Login'}>
      {authenticatedUser ? (
        <>
          <Stack.Screen
            name="Home"
            component={Home}
            options={({ navigation }) => ({
              headerRight: () => <HeaderMenu navigation={navigation} />,
            })}
          />
          <Stack.Screen
            name="Map"
            component={MapScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Settings"
            component={Settings}
            options={{
              headerShown: true,
              title: 'Settings'
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default ScreenMenu;

const styles = StyleSheet.create({});