import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ModuleTest from './ModuleTest';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ModuleTest />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
