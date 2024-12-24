import Login from './screens/auth/Login';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './context/authContext';
import Home from './screens/Home';
import Register from './screens/auth/Register';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ModuleTest from './ModuleTest';
import FooterMenu from './components/Menus/FooterMenu';
import RootNavigation from './navigation';



export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
        <RootNavigation />
    </NavigationContainer>
  );
}