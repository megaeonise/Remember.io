import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, View, Button, Alert, Text, TouchableOpacity, TextInput, Modal, FlatList, Keyboard } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { AuthContext } from '../context/authContext';

const GOOGLE_MAPS_APIKEY = ''; 

const MapScreen = ({ navigation }) => {
  const { state } = useContext(AuthContext);
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
  const searchRef = useRef(null);

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
      const newRoute = {
        userId: state.user._id,
        name: routeName,
        destination: {
          latitude: destination.latitude,
          longitude: destination.longitude
        }
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
        console.error('Error saving route:', error.response?.data || error.message);
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
    // Basic duration without traffic (convert to minutes)
    const normalDuration = Math.round(result.duration);
    setEta(normalDuration);
    
    // Get traffic data using a separate API call
    const getTrafficData = async () => {
      try {
        // Add current timestamp to ensure real-time traffic
        const timestamp = Math.floor(Date.now() / 1000);
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${debouncedLocation.latitude},${debouncedLocation.longitude}&destination=${destination.latitude},${destination.longitude}&departure_time=${timestamp}&mode=driving&traffic_model=best_guess&key=${GOOGLE_MAPS_APIKEY}`
        );
        
        if (response.data.routes && response.data.routes[0] && response.data.routes[0].legs[0]) {
          const leg = response.data.routes[0].legs[0];
          
          // Get duration in traffic in minutes
          const trafficDuration = Math.round(leg.duration_in_traffic.value / 60);
          
          // Ensure we're using the larger value as traffic duration
          const finalTrafficDuration = Math.max(trafficDuration, normalDuration);
          setEtaWithTraffic(finalTrafficDuration);
          
          // Calculate traffic density based on the difference
          const trafficDifference = finalTrafficDuration - normalDuration;
          console.log('Normal duration:', normalDuration, 'Traffic duration:', finalTrafficDuration, 'Difference:', trafficDifference);
          
          if (trafficDifference <= 2) {
            setTrafficDensity('Low');
          } else if (trafficDifference <= 10) {
            setTrafficDensity('Moderate');
          } else {
            setTrafficDensity('Heavy');
          }
          
          // Log the values for debugging
          console.log('Traffic Analysis:', {
            normalDuration,
            trafficDuration: finalTrafficDuration,
            difference: trafficDifference,
            density: trafficDifference <= 2 ? 'Low' : trafficDifference <= 10 ? 'Moderate' : 'Heavy'
          });
        }
      } catch (error) {
        console.error('Error fetching traffic data:', error.response?.data || error);
        // If we fail to get traffic data, use normal duration
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
        <>
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
                resetOnChange={false}
                optimizeWaypoints={true}
                timePrecision="now"
              />
            )}
          </MapView>

          <View style={styles.modeContainer}>
            <View style={styles.modeButtons}>
              <TouchableOpacity
                style={[styles.modeButton, mode === 'DRIVING' && styles.selectedModeButton]}
                onPress={() => setMode('DRIVING')}
              >
                <FontAwesome5 name="car" size={16} color={mode === 'DRIVING' ? '#FFFFFF' : '#007AFF'} />
                <Text style={[styles.modeButtonText, mode === 'DRIVING' && styles.selectedModeButtonText]}>
                  Driving
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeButton, mode === 'WALKING' && styles.selectedModeButton]}
                onPress={() => setMode('WALKING')}
              >
                <FontAwesome5 name="walking" size={16} color={mode === 'WALKING' ? '#FFFFFF' : '#007AFF'} />
                <Text style={[styles.modeButtonText, mode === 'WALKING' && styles.selectedModeButtonText]}>
                  Walking
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeButton, mode === 'TRANSIT' && styles.selectedModeButton]}
                onPress={() => setMode('TRANSIT')}
              >
                <FontAwesome5 name="bus" size={16} color={mode === 'TRANSIT' ? '#FFFFFF' : '#007AFF'} />
                <Text style={[styles.modeButtonText, mode === 'TRANSIT' && styles.selectedModeButtonText]}>
                  Transit
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchOuterContainer}>
            <GooglePlacesAutocomplete
              ref={searchRef}
              placeholder="Search for a destination"
              onPress={(data, details = null) => {
                if (details?.geometry?.location) {
                  const { lat, lng } = details.geometry.location;
                  setDestination({ latitude: lat, longitude: lng });
                  setSelectedRoute(null);
                  searchRef.current?.setAddressText('');
                  Keyboard.dismiss();
                }
              }}
              query={{
                key: GOOGLE_MAPS_APIKEY,
                language: 'en',
                components: 'country:bd',
                types: 'establishment|geocode',
                radius: 30000,
                location: `${location?.latitude},${location?.longitude}`,
                strictbounds: true
              }}
              fetchDetails={true}
              enablePoweredByContainer={false}
              keepResultsAfterBlur={false}
              listViewDisplayed="auto"
              keyboardShouldPersistTaps="handled"
              minLength={2}
              debounce={300}
              textInputProps={{
                placeholderTextColor: '#666',
                returnKeyType: 'search',
              }}
              styles={{
                container: {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                },
                textInputContainer: {
                  backgroundColor: 'transparent',
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                  marginHorizontal: 10,
                  marginTop: 130,
                },
                textInput: {
                  height: 45,
                  color: '#000',
                  fontSize: 16,
                  backgroundColor: 'white',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                },
                listView: {
                  backgroundColor: 'white',
                  borderRadius: 8,
                  marginHorizontal: 10,
                  marginTop: 5,
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                },
                row: {
                  padding: 13,
                  backgroundColor: 'white',
                },
                separator: {
                  height: 1,
                  backgroundColor: '#eee',
                },
                description: {
                  color: '#000',
                },
                predefinedPlacesDescription: {
                  color: '#000',
                },
              }}
            />
          </View>

          {etaWithTraffic && (
            <View style={styles.etaContainer}>
              <View style={styles.etaBox}>
                <Text style={styles.etaText}>ETA: {Math.round(etaWithTraffic)} min</Text>
                {trafficDensity !== 'Low' && trafficDensity !== 'Unknown' && (
                  <Text style={[styles.trafficText, {
                    color: trafficDensity === 'Heavy' ? '#FF4444' : '#FFA000'
                  }]}>
                    Traffic: {trafficDensity}
                  </Text>
                )}
              </View>
            </View>
          )}

          <View style={styles.bottomContainer}>
            <TextInput
              style={styles.routeNameInput}
              placeholder="Enter route name"
              value={routeName}
              onChangeText={setRouteName}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={saveRoute}>
                <Text style={styles.buttonText}>Save Route</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={loadRoutes}>
                <Text style={styles.buttonText}>Load Routes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <Text>Loading...</Text>
      )}

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
  modeContainer: {
    position: 'absolute',
    top: 70,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 8,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  selectedModeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  modeButtonText: {
    color: '#007AFF',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  selectedModeButtonText: {
    color: 'white',
  },
  searchOuterContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  etaContainer: {
    position: 'absolute',
    bottom: 140,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  etaBox: {
    alignItems: 'center',
  },
  etaText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  trafficText: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: '500',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  routeNameInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
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