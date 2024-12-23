import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Alert, Text, Switch, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBHk92652LQuKBGmGMwmi2Q5V1KkmS6hqk';

const MapScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [eta, setEta] = useState(null);
  const [dynamicMode, setDynamicMode] = useState(false);
  const [mode, setMode] = useState('DRIVING'); // Default mode is driving

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  const handleLongPress = (e) => {
    setDestination(e.nativeEvent.coordinate);
  };

  const saveRoute = async () => {
    if (location && destination) {
      const newRoute = { start: location, end: destination };
      const updatedRoutes = [...routes, newRoute];
      setRoutes(updatedRoutes);
      await AsyncStorage.setItem('@routes', JSON.stringify(updatedRoutes));
      Alert.alert('Route saved successfully');
    } else {
      Alert.alert('Please set a destination');
    }
  };

  const loadRoutes = async () => {
    const savedRoutes = await AsyncStorage.getItem('@routes');
    if (savedRoutes) {
      setRoutes(JSON.parse(savedRoutes));
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleDirectionsReady = (result) => {
    setEta(result.duration);
  };

  const checkForUpdates = async () => {
    if (location && destination) {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${location.latitude},${location.longitude}&destinations=${destination.latitude},${destination.longitude}&mode=${mode.toLowerCase()}&key=${GOOGLE_MAPS_APIKEY}`
      );
      const duration = response.data.rows[0].elements[0].duration.value / 60; // Convert seconds to minutes
      if (duration !== eta) {
        Alert.alert('Route update', 'The estimated time of arrival has changed.');
        setEta(duration);
      }
    }
  };

  useEffect(() => {
    if (dynamicMode) {
      const interval = setInterval(checkForUpdates, 5000); // Check for updates every 5 seconds
      return () => clearInterval(interval);
    }
  }, [dynamicMode, location, destination, eta, mode]);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onLongPress={handleLongPress}
        >
          <Marker coordinate={location} title="You are here" />
          {destination && <Marker coordinate={destination} title="Destination" />}
          {destination && (
            <MapViewDirections
              origin={location}
              destination={destination}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="hotpink"
              onReady={handleDirectionsReady}
              mode={mode} // Use the selected mode of transportation
            />
          )}
          {routes.map((route, index) => (
            <Polyline
              key={index}
              coordinates={[route.start, route.end]}
              strokeColor="#000"
              strokeWidth={3}
            />
          ))}
        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}
      {eta && <Text style={styles.etaText}>Estimated Time of Arrival: {Math.round(eta)} mins</Text>}
      <Button title="Save Route" onPress={saveRoute} />
      <Button title="View Saved Routes" onPress={loadRoutes} />
      <View style={styles.switchContainer}>
        <Text>Dynamic Mode</Text>
        <Switch
          value={dynamicMode}
          onValueChange={(value) => setDynamicMode(value)}
        />
      </View>
      <View style={styles.modeContainer}>
        <Text>Select Mode of Transportation:</Text>
        <View style={styles.modeButtons}>
          <Button title="Driving" onPress={() => setMode('DRIVING')} />
          <Button title="Walking" onPress={() => setMode('WALKING')} />
          <Button title="Bicycling" onPress={() => setMode('BICYCLING')} />
          <Button title="Transit" onPress={() => setMode('TRANSIT')} />
        </View>
      </View>
      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
        <FontAwesome5 name={'home'} size={20} color={'black'} style={styles.iconStyle} />
        <Text style={styles.textStyle}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  etaText: {
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom:15,
    margin: 10,
  },
  modeContainer: {
    bottom:40,
    margin: 10,
    alignItems: 'center',
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  homeButton: {
    position: 'absolute',
    bottom: 1.5,
    right: 3,

  },
  iconStyle: {
    marginBottom: 5,
  },
  textStyle: {
    color: 'black',
  },
});