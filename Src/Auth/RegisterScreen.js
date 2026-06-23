import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ALERT_TYPE, Toast, Root,Dialog } from 'react-native-alert-notification';
import { API_BASE_URL } from '../config/config';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../Style/Loginstyle';
// import styles from '../Style/RegisterStyle';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {

    // fill all inputes 
    if (!name || !email || !password) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Please Fill Your Details To Create Account',
      });
      return;
    }

    // password length
    if (password.length <= 6) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Too Short ',
        textBody: 'Password must be at least 7 characters long.',
      });
      return;
    }

    // email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Invalid Email',
        textBody: 'Please enter a valid email address',
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          message: 'Registration Successful! Redirecting to Login...',
          button: 'Go to Login',
          onPressButton: () => {
            Dialog.hide();
            navigation.navigate('LoginScreen'); // Redirect to LoginScreen
          },
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'Failed',
          textBody: data.message || 'Registration failed.',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Unable to connect to the server.',
      });
    }
  };

  return (
    <Root>
      <LinearGradient
       colors={['#a90657','#2b09a6']}
       style={styles.container}>

      <View style={styles.loginbox}>
        <Text style={styles.heading}>Create Your Account</Text>
        <Text style={styles.subheading}>Start sharing reels, posts, and pure vibes.</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Name"
          placeholderTextColor="#bbb"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder=" Enter Your Email"
          placeholderTextColor="#bbb"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Create Password"
          placeholderTextColor="#bbb"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
       
        <TouchableOpacity onPress={handleRegister} style={styles.buttonContainer}>
         
          <LinearGradient 
          colors={['#f91a89','#653ef2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.loginbtn}>
           
          <Text style={styles.buttonText}>Register</Text>
           </LinearGradient>
           </TouchableOpacity>

        
       
        <TouchableOpacity
          onPress={() => navigation.navigate('LoginScreen')}
        >

          <Text style={styles.registerText}>
            Already have an account?
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
    </Root>
  );
};

export default RegisterScreen;
