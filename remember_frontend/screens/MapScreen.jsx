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

const GOOGLE_MAPS_APIKEY = 'AIzaSyAYApDXLhlv27JXilv3CfyKYT3-r6eWZ1o';

const MapScreen = ({ navigation }) => {
  const { state } = useContext(AuthContext);
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [eta, setEta] = useState(null);
  const [etaWithTraffic, setEtaWithTraffic] = useState(null);
  const [trafficDensity, setTrafficDensity] = useState(null);
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
      
      const initialRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      
      setRegion(initialRegion);
      if (mapRef.current) {
        mapRef.current.animateToRegion(initialRegion, 1000);
      }

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 10,
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
      const newRoute = {
        userId: state.user._id,
        name: routeName,
        end: destination
      };
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
    const normalDuration = Math.round(result.duration);
    setEta(normalDuration);
    
    const getTrafficData = async () => {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${debouncedLocation.latitude},${debouncedLocation.longitude}&destination=${destination.latitude},${destination.longitude}&departure_time=${timestamp}&mode=driving&traffic_model=best_guess&key=${GOOGLE_MAPS_APIKEY}`
        );
        
        if (response.data.routes && response.data.routes[0] && response.data.routes[0].legs[0]) {
          const leg = response.data.routes[0].legs[0];
          const trafficDuration = Math.round(leg.duration_in_traffic.value / 60);
          const finalTrafficDuration = Math.max(trafficDuration, normalDuration);
          setEtaWithTraffic(finalTrafficDuration);
          
          const trafficDifference = finalTrafficDuration - normalDuration;
          
          if (trafficDifference <= 2) {
            setTrafficDensity('Low');
          } else if (trafficDifference <= 10) {
            setTrafficDensity('Moderate');
          } else {
            setTrafficDensity('Heavy');
          }
        }
      } catch (error) {
        setEtaWithTraffic(normalDuration);
        setTrafficDensity('Unknown');
      }
    };

    if (debouncedLocation && destination) {
      getTrafficData();
    }
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
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onRegionChangeComplete={handleRegionChangeComplete}
          onLongPress={handleLongPress}
          onPanDrag={() => setIsUserInteracting(true)}
          onTouchEnd={() => {
            setTimeout(() => {
              setIsUserInteracting(false);
            }, 500);
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
        placeholder='Search for a destination'
        fetchDetails={true}
        enablePoweredByContainer={false}
        onPress={(data, details = null) => {
          if (details) {
            setDestination({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            });
            setSelectedRoute(null);
          }
        }}
        query={{
          key: GOOGLE_MAPS_APIKEY,
          language: 'en',
        }}
        styles={{
          container: {
            position: 'absolute',
            top: 10,
            left: 10,
            right: 10,
            zIndex: 1,
          },
          textInput: {
            height: 45,
            borderRadius: 5,
            paddingVertical: 5,
            paddingHorizontal: 10,
            fontSize: 16,
            backgroundColor: '#fff',
          },
          listView: {
            backgroundColor: '#fff',
            borderRadius: 5,
            marginTop: 5,
          },
        }}
        debounce={300}
        minLength={2}
        returnKeyType={'search'}
        enableHighAccuracyLocation={true}
        nearbyPlacesAPI="GooglePlacesSearch"
      />

      {eta && <Text style={styles.etaText}>Estimated Time of Arrival: {Math.round(eta)} mins</Text>}
      {etaWithTraffic && <Text style={styles.etaText}>Estimated Time of Arrival with Traffic: {Math.round(etaWithTraffic)} mins</Text>}
      {trafficDensity && <Text style={styles.etaText}>Traffic Density: {trafficDensity}</Text>}
      
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