import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import {
  ALERT_TYPE,
  Toast,
  Root,
  Dialog
} from 'react-native-alert-notification';

import {
  saveToken,
  saveUser
} from '../services/authStorage';

import { API_BASE_URL } from '../config/config';

import LinearGradient from 'react-native-linear-gradient';
import styles from '../Style/Loginstyle'

const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    if (!email || !password) {

      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Please enter email and password',
      });

      return;
    }

    setLoading(true);

    try {

      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log('LOGIN RESPONSE:', data);

      if (response.ok && data.success) {

        // SAVE TOKEN
        await saveToken(data.token);

        // SAVE USER
        await saveUser(data.user);

        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          message: 'Login Successful',
          button: 'Go To Home',

          onPressButton: () => {

            Dialog.hide();

            navigation.replace('TabNavigation');
          },
        });

      } else {

        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'Login Failed',
          textBody: data.message || 'Invalid credentials',
        });
      }

    } catch (error) {

      console.log('LOGIN ERROR:', error);

      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Server Error',
        textBody: 'Unable to connect server',
      });

    } finally {

      setLoading(false);
    }
  };

  return (
    <Root>
      <View style={styles.container}>

        <Text style={styles.logo}>Welcome Back</Text>
        <Text styee={styles.logo}>Sign in to continue your vibe.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#bbb"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#bbb"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={handleLogin}
          style={styles.buttonContainer}
          disabled={loading}
        >

          {
            loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )
          }

        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('RegisterScreen')}
        >

          <Text style={styles.registerText}>
            Don't have an account?
            <Text style={{
              color: '#FF007F',
              fontWeight: '800'
            }}>
              {' '}Register
            </Text>
          </Text>

        </TouchableOpacity>

      </View>
    </Root>
  );
};

export default LoginScreen;

