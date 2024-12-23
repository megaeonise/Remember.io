import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import FooterMenu from '../components/Menus/FooterMenu';

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text></Text>
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
});