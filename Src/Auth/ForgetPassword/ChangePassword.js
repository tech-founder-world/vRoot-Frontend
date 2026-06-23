import { StyleSheet, Text, TextInput, View,TouchableOpacity,Alert } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styles from '../../Style/Loginstyle'
import { ALERT_TYPE } from 'react-native-alert-notification'

const ChangePassword = ({navigation}) => {
    const[password,setpassword]=useState("")
    const[confirmpassword,setconfirmpassword]=useState("")
 
    const changepassword=()=>
    {
       if(password===confirmpassword)
       {
          navigation.replace("LoginScreen")
       }
       else
       {
           Alert.alert("Password Don't Match")
       }
    }

  return (
    <LinearGradient
    colors={['#a90657','#2b09a6']}
       style={styles.container}>
    <View style={styles.forgetbox}>
        <Text style={[styles.heading,{marginBottom:20}]}>Change Your Password</Text>

        <TextInput style={styles.input} 
        placeholder='Enter Your New Password'
        value={password}
        onChangeText={setpassword}></TextInput>

        <TextInput style={styles.input}
        placeholder='Enter Confirm Password'
        value={confirmpassword}
        onChangeText={setconfirmpassword}></TextInput>

        <TouchableOpacity style={styles.buttonContainer}
          onPress={changepassword}>
         
          <LinearGradient 
          colors={['#f91a89','#653ef2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.loginbtn}>
           
          <Text style={styles.buttonText}>Change Password</Text>
           </LinearGradient>
           </TouchableOpacity>

    </View>
    </LinearGradient>
  )
}

export default ChangePassword

