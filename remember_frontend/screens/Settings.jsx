import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Alert, 
  TextInput,
  ScrollView,
  Platform
} from 'react-native';
import axios from 'axios';
import FooterMenu from '../components/Menus/FooterMenu';
import { PreferencesContext } from '../context/preferencesContext';
import { AuthContext } from '../context/authContext';

const Settings = ({ navigation }) => {
  const { preferences, setPreferences } = useContext(PreferencesContext);
  const { state } = useContext(AuthContext);
  const [favoriteColors, setFavoriteColors] = useState([]);
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('');
  const [showColorModal, setShowColorModal] = useState(false);
  const [showSelectColorModal, setShowSelectColorModal] = useState(false);
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [fontSizes, setFontSizes] = useState([]);
  const [showFontFamilyModal, setShowFontFamilyModal] = useState(false); 
  const [fontFamilies, setFontFamilies] = useState([]); 
  const [showWindowColorModal, setShowWindowColorModal] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('Loading initial data...');
        await loadFavoriteColors();
        await loadFontSizes();
        await loadFontFamilies();
        console.log('Initial data loaded successfully');
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    console.log('Favorite colors updated:', favoriteColors);
  }, [favoriteColors]);

  const saveFavoriteColor = async () => {
    try {
      if (!colorName.trim() || !colorHex.trim()) {
        Alert.alert('Error', 'Please enter both color name and hex value');
        return;
      }

      console.log('Saving color:', { name: colorName, color: colorHex });
      const response = await axios.post('/favoriteColors/save', {
        userId: state.user._id,
        name: colorName,
        color: colorHex
      });

      if (response.data.success) {
        console.log('Color saved successfully:', response.data.favoriteColor);
        await loadFavoriteColors();
        setShowColorModal(false);
        setColorName('');
        setColorHex('');
        Alert.alert('Success', 'Favorite color saved successfully');
      } else {
        console.error('Failed to save color:', response.data);
        Alert.alert('Error', 'Failed to save favorite color');
      }
    } catch (error) {
      console.error('Error saving favorite color:', error);
      Alert.alert('Error', 'Failed to save favorite color. Please try again.');
    }
  };

  const loadFavoriteColors = async () => {
    try {
      console.log('Loading favorite colors for user:', state.user._id);
      const response = await axios.get(`/favoriteColors/${state.user._id}`);
      console.log('Favorite colors response:', response.data);
      
      if (response.data.success && Array.isArray(response.data.favoriteColors)) {
        console.log('Setting favorite colors:', response.data.favoriteColors);
        setFavoriteColors(response.data.favoriteColors);
        return response.data.favoriteColors;
      } else {
        console.error('Invalid favorite colors response:', response.data);
        Alert.alert('Error', 'Failed to load favorite colors');
        return [];
      }
    } catch (error) {
      console.error('Error loading favorite colors:', error);
      Alert.alert('Error', 'Failed to load favorite colors. Please try again.');
      return [];
    }
  };

  const handleColorSelect = (color) => {
    console.log('Selecting color:', color);
    setPreferences({
      ...preferences,
      backgroundColor: color
    });
    setShowSelectColorModal(false);
  };

  const handleWindowColorSelect = (color) => {
    console.log('Selecting window color:', color);
    setPreferences({
      ...preferences,
      windowColor: color
    });
    setShowWindowColorModal(false);
  };

  const loadFontSizes = async () => {
    try {
      const response = await axios.get('/fontSizes');
      if (response.data.success) {
        setFontSizes(response.data.fontSizes);
      } else {
        Alert.alert('Error', 'Failed to load font sizes');
      }
    } catch (error) {
      console.error('Error loading font sizes:', error);
      Alert.alert('Error', 'Failed to load font sizes. Please try again.');
    }
  };

  const loadFontFamilies = async () => {
    try {
      const response = await axios.get('/fontFamilies');
      if (response.data.success) {
        setFontFamilies(response.data.fontFamilies);
      } else {
        Alert.alert('Error', 'Failed to load font families');
      }
    } catch (error) {
      console.error('Error loading font families:', error);
      Alert.alert('Error', 'Failed to load font families. Please try again.');
    }
  };

  const applyFontSize = (size) => {
    setPreferences({
      ...preferences,
      fontSize: size
    });
    setShowFontSizeModal(false);
  };

  const applyFontFamily = (family) => {
    setPreferences({
      ...preferences,
      fontFamily: family
    });
    setShowFontFamilyModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: preferences.backgroundColor }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>App Settings</Text>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: preferences.windowColor || '#1BBAC8' }]}
          onPress={() => setShowColorModal(true)}
        >
          <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Save Color</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: preferences.windowColor || '#1BBAC8' }]}
          onPress={() => setShowSelectColorModal(true)}
        >
          <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Select Color</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: preferences.windowColor || '#1BBAC8' }]}
          onPress={() => setShowWindowColorModal(true)}
        >
          <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Select Window Color</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: preferences.windowColor || '#1BBAC8' }]}
          onPress={() => setShowFontSizeModal(true)}
        >
          <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Select Font Size</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: preferences.windowColor || '#1BBAC8' }]}
          onPress={() => setShowFontFamilyModal(true)}
        >
          <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Select Font Family</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showColorModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Color Name"
            value={colorName}
            onChangeText={setColorName}
          />
          <TextInput
            style={styles.input}
            placeholder="Color Hex (e.g., #FF0000)"
            value={colorHex}
            onChangeText={setColorHex}
          />
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: preferences.windowColor || '#1BBAC8' }]}
            onPress={saveFavoriteColor}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.closeButton, { backgroundColor: preferences.windowColor || '#FF6B6B' }]}
            onPress={() => setShowColorModal(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={showSelectColorModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalView}>
          <ScrollView style={styles.modalContent}>
            {favoriteColors && favoriteColors.map((favColor, index) => (
              <TouchableOpacity 
                key={favColor._id || index}
                style={[styles.favoriteColorButton, { backgroundColor: favColor.color }]}
                onPress={() => handleColorSelect(favColor.color)}
              >
                <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>
                  {favColor.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity 
            style={[styles.closeButton, { backgroundColor: preferences.windowColor || '#FF6B6B' }]}
            onPress={() => setShowSelectColorModal(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={showWindowColorModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalView}>
          <ScrollView style={styles.modalContent}>
            {favoriteColors && favoriteColors.map((favColor, index) => (
              <TouchableOpacity 
                key={favColor._id || index}
                style={[styles.favoriteColorButton, { backgroundColor: favColor.color }]}
                onPress={() => handleWindowColorSelect(favColor.color)}
              >
                <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>
                  {favColor.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity 
            style={[styles.closeButton, { backgroundColor: preferences.windowColor || '#FF6B6B' }]}
            onPress={() => setShowWindowColorModal(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={showFontSizeModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalView}>
          {fontSizes.map((fontSize) => (
            <TouchableOpacity
              key={fontSize._id}
              style={[
                styles.fontSizeButton,
                { backgroundColor: preferences.windowColor || '#1BBAC8' },
                preferences.fontSize === fontSize.size && { backgroundColor: '#FF6B6B' }
              ]}
              onPress={() => applyFontSize(fontSize.size)}
            >
              <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>
                {fontSize.size}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            style={[styles.closeButton, { backgroundColor: preferences.windowColor || '#FF6B6B' }]}
            onPress={() => setShowFontSizeModal(false)}
          >
            <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={showFontFamilyModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalView}>
          <ScrollView>
            {fontFamilies.map((fontFamily) => (
              <TouchableOpacity
                key={fontFamily._id}
                style={[
                  styles.fontFamilyButton,
                  { backgroundColor: preferences.windowColor || '#1BBAC8' },
                  preferences.fontFamily === fontFamily.family && { backgroundColor: '#FF6B6B' }
                ]}
                onPress={() => applyFontFamily(fontFamily.family)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { fontSize: preferences.fontSize, fontFamily: fontFamily.family }
                  ]}
                >
                  {fontFamily.family}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity 
            style={[styles.closeButton, { backgroundColor: preferences.windowColor || '#FF6B6B' }]}
            onPress={() => setShowFontFamilyModal(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <FooterMenu navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1BBAC8',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 100,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  favoriteColorButton: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    maxHeight: 400,
  },
  fontSizeButton: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    backgroundColor: '#1BBAC8',
    alignItems: 'center',
  },
  fontFamilyButton: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    backgroundColor: '#1BBAC8',
    alignItems: 'center',
  },
});

export default Settings;