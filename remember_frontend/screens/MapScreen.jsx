import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Button, Alert, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { AuthContext } from '../context/authContext';
import FooterMenu from '../components/Menus/FooterMenu'; // Corrected import path

const GOOGLE_MAPS_APIKEY = '';

const MapScreen = ({ navigation }) => {
  const { state } = useContext(AuthContext);
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
      const newRoute = { userId: state.user._id, start: location, end: destination };
      console.log(newRoute)
      try {
        const response = await axios.post('/routes/save', newRoute);
        if (response.data.success) {
          setRoutes([...routes, response.data.route]);
          Alert.alert('Route saved successfully');
        } else {
          Alert.alert('Failed to save route');
        }
      } catch (error) {
        console.error('Error saving route:', error);
        Alert.alert('Error', 'Failed to save route. Please try again.');
      }
    } else {
      Alert.alert('Please set a destination');
    }
  };

  const loadRoutes = async () => {
    console.log('its there')
    try {
      const response = await axios.get(`/routes/${state.user._id}`);
      if (response.data.success) {
        setRoutes(response.data.routes);
      } else {
        Alert.alert('Failed to load routes');
      }
    } catch (error) {
      console.error('Error loading routes:', error);
      Alert.alert('Error', 'Failed to load routes. Please try again.');
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
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${location.latitude},${location.longitude}&destinations=${destination.latitude},${destination.longitude}&mode=${mode.toLowerCase()}&key=${GOOGLE_MAPS_APIKEY}`
        );
        const duration = response.data.rows[0].elements[0].duration.value / 60; // Convert seconds to minutes
        if (duration !== eta) {
          Alert.alert('Route update', 'The estimated time of arrival has changed.');
          setEta(duration);
        }
      } catch (error) {
        console.error('Error fetching updates:', error);
        Alert.alert('Error', 'Failed to fetch route updates. Please try again.');
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
              mode={mode.toUpperCase()} // Use the selected mode of transportation in uppercase
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
      <GooglePlacesAutocomplete
        placeholder="Search for a destination"
        onPress={(data, details = null) => {
          const { lat, lng } = details.geometry.location;
          setDestination({ latitude: lat, longitude: lng });
        }}
        query={{
          key: GOOGLE_MAPS_APIKEY,
          language: 'en',
        }}
        fetchDetails={true}
        styles={{
          container: {
            flex: 0,
            position: 'absolute',
            width: '100%',
            zIndex: 1,
            top: 10, // Adjust the position to make it visible
          },
          textInputContainer: {
            width: '100%',
            backgroundColor: 'white',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#ddd',
            padding: 5,
          },
          textInput: {
            height: 38,
            color: '#5d5d5d',
            fontSize: 16,
          },
          listView: {
            backgroundColor: 'white',
          },
        }}
      />
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
    bottom: 15,
    margin: 10,
  },
  modeContainer: {
    bottom: 40,
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