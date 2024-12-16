import { StyleSheet, Text, TextInput, View } from 'react-native'
import React,{useState} from 'react'
import InputBox from '../../components/InputBox'
import SubmitButton from '../../components/SubmitButton';
import {Alert} from 'react-native'
import axios from 'axios';
// States
const Register = ({navigation}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

// Functions
const handleSubmit = async () => {
  console.log("Button Pressed")
  try {
    setLoading(true);
    if(!name || !email || !password){
      setLoading(false);
      Alert.alert('Please fill all the fields');
      return;
  }
  
  setLoading(false);
  const {data} = await axios.post('http://192.168.68.108:4000/api/v1/auth/register',{name,email,password});
  Alert.alert(data && data.message);
  console.log('Registered')
}catch (error) {
    Alert.alert(error.response.data.message);
    setLoading(false)
    console.log(error)
  }
};
  return (
    <View style = {styles.container}>
      <Text style = {styles.Title}>Register</Text>
      <View >
        <InputBox inputTitle = {'Name:'} value = {name} setValue = {setName} />
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
      <SubmitButton btnTitle = {'Register'} loading = {loading} handleSubmit={handleSubmit}/>
      <Text style={styles.linkText}>Already have an account? <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Login</Text></Text>
    </View>
  )
};

export default Register;

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