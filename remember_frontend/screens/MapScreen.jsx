import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, View, Button, Alert, Text, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { AuthContext } from '../context/authContext';


const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE;
 

const MapScreen = ({ navigation }) => {
  const { state } = useContext(AuthContext);
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [eta, setEta] = useState(null);
  const [mode, setMode] = useState('DRIVING');
  const [routeName, setRouteName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [region, setRegion] = useState(null);
  const [debouncedLocation, setDebouncedLocation] = useState(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const regionTimeoutRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      
      if (!region) {
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );
    })();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedLocation(location);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [location]);

  const handleLongPress = (e) => {
    setDestination(e.nativeEvent.coordinate);
    setSelectedRoute(null);
  };

  const saveRoute = async () => {
    if (destination) {
      if (!routeName) {
        Alert.alert('Please enter a name for the route');
        return;
      }
      const newRoute = { userId: state.user._id, name: routeName, destination: destination };
      try {
        const response = await axios.post('/routes/save', newRoute);
        if (response.data.success) {
          setRoutes([...routes, response.data.route]);
          Alert.alert('Route saved successfully');
          setRouteName('');
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
    try {
      const response = await axios.get(`/routes/${state.user._id}`);
      if (response.data.success) {
        setRoutes(response.data.routes);
        setModalVisible(true);
      } else {
        Alert.alert('Failed to load routes');
      }
    } catch (error) {
      console.error('Error loading routes:', error);
      Alert.alert('Error', 'Failed to load routes. Please try again.');
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    setDestination(route.end);
    setModalVisible(false);
  };

  const handleDirectionsReady = (result) => {
    setEta(result.duration);
  };

  const handleRegionChangeComplete = (newRegion) => {
    if (regionTimeoutRef.current) {
      clearTimeout(regionTimeoutRef.current);
    }
    regionTimeoutRef.current = setTimeout(() => {
      if (!isUserInteracting) {
        setRegion(newRegion);
      }
    }, 50);
  };

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
          region={region}
          onRegionChangeComplete={handleRegionChangeComplete}
          onLongPress={handleLongPress}
          onPanDrag={() => setIsUserInteracting(true)}
          onTouchEnd={() => {
            setTimeout(() => {
              setIsUserInteracting(false);
            }, 200);
          }}
        >
          <Marker coordinate={location} title="You are here" />
          {destination && <Marker coordinate={destination} title="Destination" />}
          {destination && debouncedLocation && (
            <MapViewDirections
              origin={debouncedLocation}
              destination={destination}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="hotpink"
              onReady={handleDirectionsReady}
              mode={mode.toUpperCase()}
            />
          )}
        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}

      <GooglePlacesAutocomplete
        placeholder="Search for a destination"
        onPress={(data, details = null) => {
          const { lat, lng } = details.geometry.location;
          setDestination({ latitude: lat, longitude: lng });
          setSelectedRoute(null);
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
            zIndex: 999,
            elevation: 999,
            top: 10,
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
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 5,
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 999,
            elevation: 999,
          },
          row: {
            padding: 13,
            height: 44,
            flexDirection: 'row',
          },
          separator: {
            height: 0.5,
            backgroundColor: '#c8c7cc',
          },
        }}
      />

      {eta && <Text style={styles.etaText}>Estimated Time of Arrival: {Math.round(eta)} mins</Text>}
      
      <View style={styles.buttonsContainer}>
        <TextInput
          style={styles.routeNameInput}
          placeholder="Enter route name"
          value={routeName}
          onChangeText={setRouteName}
        />
        <Button title="Save Route" onPress={saveRoute} />
        <Button title="View Saved Routes" onPress={loadRoutes} />
      </View>

      <View style={styles.modeContainer}>
        <Text>Select Mode of Transportation:</Text>
        <View style={styles.modeButtons}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'DRIVING' && styles.selectedModeButton]}
            onPress={() => setMode('DRIVING')}
          >
            <Text style={styles.modeButtonText}>Driving</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'WALKING' && styles.selectedModeButton]}
            onPress={() => setMode('WALKING')}
          >
            <Text style={styles.modeButtonText}>Walking</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'TRANSIT' && styles.selectedModeButton]}
            onPress={() => setMode('TRANSIT')}
          >
            <Text style={styles.modeButtonText}>Transit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
        <FontAwesome5 name={'home'} size={20} color={'black'} style={styles.iconStyle} />
        <Text style={styles.textStyle}>Home</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Saved Routes</Text>
          <FlatList
            data={routes}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleRouteSelect(item)}>
                <Text style={styles.routeItem}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
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
  routeNameInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttonsContainer: {
    padding: 10,
    backgroundColor: 'white',
  },
  modeContainer: {
    padding: 10,
    marginBottom: 60,
    backgroundColor: 'white',
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 5,
  },
  modeButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedModeButton: {
    backgroundColor: '#1BBAC8',
  },
  modeButtonText: {
    color: 'white',
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  routeItem: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});