import { Image, StyleSheet, Text, TextInput, View,TouchableOpacity } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styles from '../../Style/Loginstyle'

const VerifyOtp = ({navigation}) => {
  return (
    <LinearGradient 
     colors={['#a90657','#2b09a6']}
       style={styles.container}>

    <View style={styles.forgetbox}>
      <Image source={require("../../Assests/verify.png")}
      style={styles.forgetpic}/>
      <View style={{flexDirection:'row',gap:10}}>
        <TextInput style={styles.otpbox} 
        keyboardType='numeric'
        maxLength={1}></TextInput>

      <TextInput style={styles.otpbox}
       keyboardType='numeric'
      maxLength={1}></TextInput>

       <TextInput style={styles.otpbox}
        keyboardType='numeric'
       maxLength={1}></TextInput>

       <TextInput style={styles.otpbox}
        keyboardType='numeric'
       maxLength={1}></TextInput>

        <TextInput style={styles.otpbox} 
        keyboardType='numeric'
        maxLength={1}></TextInput>

        <TextInput style={styles.otpbox}
         keyboardType='numeric'
        maxLength={1}></TextInput>
        
      </View>
      <TouchableOpacity style={styles.buttonContainer}
          onPress={()=>navigation.navigate("changepassword")}>
         
          <LinearGradient 
          colors={['#f91a89','#653ef2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.loginbtn}>
           
          <Text style={styles.buttonText}>Verify OTP</Text>
           </LinearGradient>
           </TouchableOpacity>
    </View>
    </LinearGradient>
  )
}

export default VerifyOtp

