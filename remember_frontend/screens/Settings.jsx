
import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Alert, 
  TextInput 
} from 'react-native';
import axios from 'axios';
import FooterMenu from '../components/Menus/FooterMenu';
import { PreferencesContext } from '../context/preferencesContext';
import { AuthContext } from '../context/authContext';

const Settings = ({ navigation }) => {
  const { preferences, setPreferences } = useContext(PreferencesContext);
  const { state } = useContext(AuthContext);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [favoriteColorsVisible, setFavoriteColorsVisible] = useState(false);
  const [favoriteColors, setFavoriteColors] = useState([]);
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('');
  const [showColorModal, setShowColorModal] = useState(false);
  const [showSelectColorModal, setShowSelectColorModal] = useState(false);
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [fontSizes, setFontSizes] = useState([]);
  const [showFontFamilyModal, setShowFontFamilyModal] = useState(false); 
  const [fontFamilies, setFontFamilies] = useState([]); 

  useEffect(() => {
    loadFavoriteColors();
    loadFontSizes();
    loadFontFamilies(); // 
  }, []);

  const handleColorSelection = (color) => {
    setPreferences({
      ...preferences,
      backgroundColor: color
    });
    setColorPickerVisible(false);
  };

  const showColorPicker = () => {
    setColorPickerVisible(true);
  };

  const saveFavoriteColor = async () => {
    try {
      const response = await axios.post('/favoriteColors/save', {
        userId: state.user._id,
        name: colorName,
        color: colorHex
      });
      if (response.data.success) {
        Alert.alert('Success', 'Favorite color saved successfully');
        loadFavoriteColors();
        setShowColorModal(false);
        setColorName('');
        setColorHex('');
      } else {
        Alert.alert('Error', 'Failed to save favorite color');
      }
    } catch (error) {
      console.error('Error saving favorite color:', error);
      Alert.alert('Error', 'Failed to save favorite color. Please try again.');
    }
  };

  const loadFavoriteColors = async () => {
    try {
      const response = await axios.get(`/favoriteColors/${state.user._id}`);
      if (response.data.success) {
        setFavoriteColors(response.data.favoriteColors);
      } else {
        Alert.alert('Error', 'Failed to load favorite colors');
      }
    } catch (error) {
      console.error('Error loading favorite colors:', error);
      Alert.alert('Error', 'Failed to load favorite colors. Please try again.');
    }
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

  const applyFavoriteColor = (color) => {
    setPreferences({
      ...preferences,
      backgroundColor: color
    });
    setShowSelectColorModal(false);
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
          style={styles.button}
          onPress={() => setShowColorModal(true)}
        >
          <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Save Favorite Color</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => setShowSelectColorModal(true)}
        >
          <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Select Favorite Color</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => setShowFontSizeModal(true)}
        >
          <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Select Font Size</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => setShowFontFamilyModal(true)}
        >
          <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Select Font Family</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={colorPickerVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalView}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setColorPickerVisible(false)}
          >
            <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={showColorModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalView}>
          <TextInput
            style={[styles.input, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}
            placeholder="Enter Color Name"
            value={colorName}
            onChangeText={setColorName}
          />
          <TextInput
            style={[styles.input, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}
            placeholder="Enter Color Hex Code"
            value={colorHex}
            onChangeText={setColorHex}
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={saveFavoriteColor}
          >
            <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowColorModal(false)}
          >
            <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={showSelectColorModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalView}>
          {favoriteColors.map((favColor, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.favoriteColorButton, { backgroundColor: favColor.color }]}
              onPress={() => applyFavoriteColor(favColor.color)}
            >
              <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>{favColor.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowSelectColorModal(false)}
          >
            <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={showFontSizeModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalView}>
          {fontSizes.map((fontSize, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.fontSizeButton}
              onPress={() => applyFontSize(fontSize.size)}
            >
              <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>{fontSize.size}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            style={styles.closeButton}
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
          {fontFamilies.map((fontFamily, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.fontFamilyButton}
              onPress={() => applyFontFamily(fontFamily.family)}
            >
              <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>{fontFamily.family}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowFontFamilyModal(false)}
          >
            <Text style={[styles.buttonText, { fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }]}>Close</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  favoriteColorButton: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  fontSizeButton: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  fontFamilyButton: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default Settings;