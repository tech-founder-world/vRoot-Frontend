import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
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
import styles from '../Style/Loginstyle';

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
      // ✅ UPDATED: New login endpoint with email verification check
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
        // ✅ Check if email not verified
        if (data.userId) {
          // Email not verified - Show dialog to verify
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: '📧 Email Not Verified',
            message: 'Please verify your email first. We\'ll send you an OTP.',
            button: 'Verify Now',
            onPressButton: () => {
              Dialog.hide();
              // Navigate to VerifyEmail screen
              navigation.navigate('VerifyEmail', {
                userId: data.userId,
                email: data.email || email,
              });
            },
          });
        } else {
          Toast.show({
            type: ALERT_TYPE.WARNING,
            title: 'Login Failed',
            textBody: data.message || 'Invalid credentials',
          });
        }
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
      <LinearGradient
        colors={['#a90657', '#2b09a6']}
        style={styles.container}
      >
        <View style={styles.loginbox}>
          <Image
            source={require("../Assests/logo.png")}
            style={styles.loginlogo}
          />
          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.subheading}>Sign in to continue your vibe.</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#bbb"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#bbb"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />

          {/* ✅ Forgot Password Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Getotp')}
            style={{ alignSelf: 'flex-end', marginBottom: 10 }}
          >
            <Text style={{ color: '#bbb', fontSize: 14 }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={['#f91a89', '#653ef2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginbtn}
            >
              {
                loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )
              }
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('RegisterScreen')}
          >
            <Text style={styles.registerText}>
              Don't have an account?
              <Text style={{
                color: 'white',
                fontWeight: '800'
              }}>
                {' '}Register
              </Text>
            </Text>
          </TouchableOpacity>

        </View>
      </LinearGradient>
    </Root>
  );
};

export default LoginScreen;