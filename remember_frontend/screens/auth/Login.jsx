import { StyleSheet, Text, TextInput, View } from 'react-native'
import React,{useState,useContext} from 'react'
import { AuthContext } from '../../context/authContext';
import InputBox from '../../components/InputBox'
import SubmitButton from '../../components/SubmitButton';
import {Alert} from 'react-native'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// States
const Login = ({navigation}) => {

  const {state,setState} = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

// Functions
const handleSubmit = async () => {
  console.log("Button Pressed")
  try {
    setLoading(true);
    if(!email || !password){
      setLoading(false);
      Alert.alert('Please fill all the fields');
      return;
  }
  setLoading(false);
  const {data} = await axios.post('/auth/login',{email,password});
  setState(data);
  console.log(data, 'did this work')
  await AsyncStorage.setItem('@auth',JSON.stringify(data));
  alert(data && data.message);
  navigation.navigate('Home');
  console.log('Logged In')
}catch (error) {
    Alert.alert(error.response.data.message);
    setLoading(false)
    console.log(error)
  }
  getLocalStorageData();
};
const getLocalStorageData = async () => {
  let data = await AsyncStorage.getItem('@auth');
  console.log("Storage Data =>",data);
}
  return (
    <View style = {styles.container}>
      <Text style = {styles.Title}>Login</Text>
      <View>
        <InputBox
         inputTitle = {'Email:' }
          keyboardType={'email-address'}
           autoComplete={'email'}
           value={email} 
           setValue={setEmail}
           />
        <InputBox 
        inputTitle = {'Password:'} 
        secureTextEntry={true} 
        autoComplete={'password'}
        value={password}
         setValue={setPassword}
         />
      </View>
      <SubmitButton btnTitle = {'Login'} loading = {loading} handleSubmit={handleSubmit}/>
      <Text style={styles.linkText}>Don't have an account? <Text style={styles.link} onPress={() => navigation.navigate('Register')}>Register</Text></Text>   
    </View>
  )
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1BBAC8',
  },

  Title: {justifyContent:'Center',
    fontSize:20,
    textAlign:'center',
    marginBottom:20,
    
    
  },

  linkText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
    marginRight:20,
  },

  link: {
    color: 'blue',
    fontWeight: 400,


  }
  

})