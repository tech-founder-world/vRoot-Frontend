import { StyleSheet, Text, TextInput, View,TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styles from '../../Style/Loginstyle'
import VerifyOtp from './VerifyOtp'

const GetOtp = ({navigation}) => {
  const[email,setemail]=useState("")
   
  return (
    <LinearGradient
       colors={['#a90657','#2b09a6']}
       style={styles.container}>

    <View style={styles.forgetbox}>
        <Image source={require("../../Assests/forget.png")}
        style={styles.forgetpic}/>

        <Text style={styles.heading}>Forget Password?</Text>
        <Text>Enter your email and we'll send you a code</Text>
        <TextInput style={[styles.input,{marginTop:20}]}
         placeholder='Enter Your Email'
         value={email}
         onChangeText={setemail}></TextInput>

         <TouchableOpacity style={styles.buttonContainer}
          onPress={()=>navigation.navigate("Verifyotp")}>
         
          <LinearGradient 
          colors={['#f91a89','#653ef2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.loginbtn}>
           
          <Text style={styles.buttonText}>Get OTP</Text>
           </LinearGradient>
           </TouchableOpacity>

           <TouchableOpacity onPress={()=>navigation.navigate("LoginScreen")}>
            <Text style={styles.registerText}>
            Remember It?
            <Text style={{
              color: 'white',
              fontWeight: '800'
            }}>
              {' '}Login
            </Text>
          </Text>
          </TouchableOpacity>
    </View>
    </LinearGradient>
  )
}

export default GetOtp

