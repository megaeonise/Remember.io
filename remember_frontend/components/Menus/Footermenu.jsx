import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext } from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { PreferencesContext } from '../../context/preferencesContext';
import MapScreen from '../../screens/MapScreen';
import { useNavigation } from 'expo-router';

const FooterMenu = ({ navigation }) => {
  const { preferences } = useContext(PreferencesContext);

  return (
    <View style={[styles.container, { backgroundColor: preferences.windowColor }]}>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
        <FontAwesome5 name={'home'} size={preferences.fontSize - 1} color={'black'} style={styles.iconStyle} />
        <Text style={[styles.textStyle, { fontSize: preferences.fontSize - 4, fontFamily: preferences.fontFamily }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
        <FontAwesome5 name={'cog'} size={preferences.fontSize - 1} color={'black'} style={styles.iconStyle} />
        <Text style={[styles.textStyle, { fontSize: preferences.fontSize - 4, fontFamily: preferences.fontFamily }]}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Map")}>
        <FontAwesome5 name={'map-marked-alt'} size={preferences.fontSize - 1} color={'black'} style={styles.iconStyle} />
        <Text style={[styles.textStyle, { fontSize: preferences.fontSize - 4, fontFamily: preferences.fontFamily }]}>Map</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("TaskList")}>
        <FontAwesome5 name={'check-square'} size={preferences.fontSize - 1} color={'black'} style={styles.iconStyle} />
        <Text style={[styles.textStyle, { fontSize: preferences.fontSize - 4, fontFamily: preferences.fontFamily }]}>TaskList</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Timer")}>
        <FontAwesome5 name={'clock'} size={preferences.fontSize - 1} color={'black'} style={styles.iconStyle} />
        <Text style={[styles.textStyle, { fontSize: preferences.fontSize - 4, fontFamily: preferences.fontFamily }]}>Time</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FooterMenu;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  menuItem: {
    alignItems: 'center',
  },
  iconStyle: {
    marginBottom: 3,
  },
  textStyle: {
    color: 'black',
  },
});