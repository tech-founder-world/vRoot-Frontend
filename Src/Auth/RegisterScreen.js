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
      <View style={styles.container}>
        <Text style={styles.logo}>vRoot</Text>
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
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <Text
          style={styles.loginText}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          Already have an account ? <Text style={{ color: '#FF007F', textDecorationLine: 'underline',fontWeight:'800' }}>login</Text>
        </Text>
      </View>
    </Root>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  logo: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    backgroundColor: '#FF007F',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#bbb',
    fontSize: 14,
    marginVertical: 30
  },
});
