import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import React from 'react'

const SubmitButton = ({handleSubmit,btnTitle,loading}) => {
  return (
    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
      <Text style={styles.submitText}>{loading ? "Please Wait":btnTitle}</Text>
        </TouchableOpacity>
  );
};

export default SubmitButton

const styles = StyleSheet.create({

    submitBtn: {

        backgroundColor:'#392b28',
        width: 250,
        height: 50,
        borderRadius:80,
        alignItems:'center',
        justifyContent:'center',
        marginTop:20,
        marginHorizontal:50,
        
        
    },

    submitText:{

        color:'white',
        fontSize:24,
        fontWeight: 400,

    }

});