import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const FooterMenu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
        <FontAwesome5 name={'home'} size={20} color={'black'} style={styles.iconStyle} />
        <Text style={styles.textStyle}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('About')}>
        <FontAwesome5 name={'info-circle'} size={20} color={'black'} style={styles.iconStyle} />
        <Text style={styles.textStyle}>About</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
        <FontAwesome5 name={'cog'} size={20} color={'black'} style={styles.iconStyle} />
        <Text style={styles.textStyle}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Map')}>
        <FontAwesome5 name={'map-marked-alt'} size={20} color={'black'} style={styles.iconStyle} />
        <Text style={styles.textStyle}>Map</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FooterMenu;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1BBAC8',
    padding: 10,
  },
  menuItem: {
    alignItems: 'center',
  },
  iconStyle: {
    marginBottom: 5,
  },
  textStyle: {
    color: 'white',
  },
});