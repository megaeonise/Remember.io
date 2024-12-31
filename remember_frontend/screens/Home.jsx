
import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import FooterMenu from '../components/Menus/FooterMenu';
import ModuleTest from '../ModuleTest';
import { PreferencesContext } from '../context/preferencesContext';

const Home = ({ navigation }) => {
  const { preferences } = useContext(PreferencesContext);

  return (
    <View style={[styles.container, { backgroundColor: preferences.backgroundColor }]}>
      <Text style={[styles.text, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Home Screen</Text>
      <ModuleTest />
      <FooterMenu navigation={navigation} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  text: {
    padding: 12,
  },
});