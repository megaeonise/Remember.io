import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, View, Button, Alert, Text, TouchableOpacity, TextInput, Modal, FlatList, Switch } from 'react-native';
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
  const [dynamicMode, setDynamicMode] = useState(false);
  const [currentBestRoute, setCurrentBestRoute] = useState(null);
  const regionTimeoutRef = useRef(null);

  useEffect(() => {
    let locationSubscription;
    
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });
        
        const initialRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        
        setLocation(location.coords);
        setRegion(initialRegion);
        
        if (mapRef.current) {
          mapRef.current.animateToRegion(initialRegion, 1000);
        }

        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 10,
          },
          (newLocation) => {
            setLocation(newLocation.coords);
            if (!isUserInteracting && mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }, 1000);
            }
          }
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to get location. Please check your GPS settings.');
      }
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedLocation(location);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [location]);

  useEffect(() => {
    setCurrentBestRoute(null);
  }, [destination]);

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
    
    if (dynamicMode && destination) {
      if (currentBestRoute) {
        // Check if new route is at least 2 minutes faster
        if (currentBestRoute.duration - result.duration > 2) {
          Alert.alert(
            'Better Route Found',
            `A faster route has been found that saves ${Math.round(currentBestRoute.duration - result.duration)} minutes.`
          );
          setCurrentBestRoute({
            duration: result.duration,
            distance: result.distance
          });
        }
      } else {
        // Store first route as current best
        setCurrentBestRoute({
          duration: result.duration,
          distance: result.distance
        });
      }
    }
    
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
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          onLongPress={handleLongPress}
          onPanDrag={() => setIsUserInteracting(true)}
          onRegionChangeComplete={() => setIsUserInteracting(false)}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="You are here"
            />
          )}
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
            top: 40,
            left: 10,
            right: 10,
            zIndex: 1,
          },
          textInput: {
            height: 50,
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 15,
            fontSize: 16,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            borderWidth: 1,
            borderColor: '#ddd',
          },
          listView: {
            backgroundColor: '#fff',
            borderRadius: 10,
            marginTop: 5,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            borderWidth: 1,
            borderColor: '#ddd',
          },
          row: {
            padding: 13,
            height: 50,
            flexDirection: 'row',
          },
          separator: {
            height: 1,
            backgroundColor: '#ddd',
          },
          description: {
            fontSize: 15,
          },
        }}
        debounce={300}
        minLength={2}
        returnKeyType={'search'}
        enableHighAccuracyLocation={true}
        nearbyPlacesAPI="GooglePlacesSearch"
      />

      {etaWithTraffic && <Text style={styles.etaText}>ETA: {Math.round(etaWithTraffic)} mins</Text>}
      {trafficDensity && <Text style={styles.etaText}>Traffic Density: {trafficDensity}</Text>}
      
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ marginRight: 10 }}>Dynamic Mode</Text>
          <Switch
            value={dynamicMode}
            onValueChange={(value) => {
              setDynamicMode(value);
              if (value) {
                setCurrentBestRoute(null);
              }
            }}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={dynamicMode ? "#4CAF50" : "#f4f3f4"}
          />
        </View>
      </View>

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

      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
        <FontAwesome5 name={'home'} size={20} color={'black'} style={styles.iconStyle} />
        <Text style={styles.textStyle}>Home</Text>
      </TouchableOpacity>

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
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
  infoContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  etaText: {
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
  },
  modeContainer: {
    padding: 10,
    marginBottom: 60,
    backgroundColor: 'white',
  },
  buttonsContainer: {
    padding: 10,
    backgroundColor: 'white',
  },
  homeButton: {
    position: 'absolute',
    bottom: 1.5,
    right: 3,
  },
  routeNameInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',

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