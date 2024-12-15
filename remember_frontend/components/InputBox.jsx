import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const InputBox = ({inputTitle,autoComplete,keyboardType,secureTextEntry=false,value,setValue}) => { 
  return (
    <View>
      <Text style = {styles.nameTitle}>{inputTitle} </Text>
      <TextInput style = {styles.inputBox}
      autoCorrect = {false}
      keyboardType = {keyboardType}
      autoComplete= {autoComplete}
      secureTextEntry = {secureTextEntry}
      value= {value}
      onChangeText= {setValue}
      />
    </View>
  )
}

export default InputBox

const styles = StyleSheet.create({

    nameTitle: {

        marginTop:10,
        marginBottom:10,
        marginLeft:10,
        fontWeight:'bold',
      },
      inputBox:{
        marginLeft:10,
        marginRight:10,
        width: 345,
        height: 50,
        backgroundColor:'white',
        paddingLeft: 10,
        borderRadius:10,
      }


})