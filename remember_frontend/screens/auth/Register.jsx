import { StyleSheet, Text, TextInput, View } from 'react-native'
import React,{useState} from 'react'
import InputBox from '../../components/InputBox'

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

})