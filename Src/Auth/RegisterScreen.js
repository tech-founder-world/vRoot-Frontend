import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { ALERT_TYPE, Toast, Root, Dialog } from 'react-native-alert-notification';
import { API_BASE_URL } from '../config/config';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../Style/Loginstyle';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // ✅ Validation
    if (!name || !email || !password) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Please Fill Your Details To Create Account',
      });
      return;
    }

    if (password.length <= 6) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Too Short',
        textBody: 'Password must be at least 7 characters long.',
      });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Invalid Email',
        textBody: 'Please enter a valid email address',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('📤 Sending registration request...');
      
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

      // ✅ FIRST: Get raw response text
      const textResponse = await response.text();
      console.log('📥 Raw Response:', textResponse);

      // ✅ SECOND: Parse JSON
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        console.log('Response was not JSON:', textResponse);
        
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Server Error',
          textBody: 'Server returned invalid response',
        });
        setLoading(false);
        return;
      }

      console.log('📊 Parsed Data:', data);

      // ✅ THIRD: Check response
      if (response.ok && data.success) {
        // Success - Navigate to OTP verification
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: '✅ Account Created!',
          message: 'Please verify your email. We\'ve sent an OTP.',
          button: 'Verify Now',
          onPressButton: () => {
            Dialog.hide();
            navigation.navigate('Verifyotp', {
              userId: data.userId,
              email: data.email || email,
            });
          },
        });
      } else {
        // ❌ Error response
        let errorMessage = data.message || 'Registration failed. Please try again.';
        
        // ✅ Check if email already exists but not verified
        if (data.userId && !data.isVerified) {
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: 'Email Not Verified',
            message: 'This email is already registered but not verified. Would you like to verify now?',
            button: 'Verify Now',
            onPressButton: () => {
              Dialog.hide();
              navigation.navigate('Verifyotp', {
                userId: data.userId,
                email: data.email || email,
              });
            },
          });
          setLoading(false);
          return;
        }

        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Registration Failed',
          textBody: errorMessage,
        });
      }
    } catch (error) {
      console.error('❌ Network Error:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Unable to connect to the server. Please check your internet connection.',
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
          <Text style={styles.heading}>Create Your Account</Text>
          <Text style={styles.subheading}>Start sharing reels, posts, and pure vibes.</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Your Name"
            placeholderTextColor="#bbb"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Your Email"
            placeholderTextColor="#bbb"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Create Password"
            placeholderTextColor="#bbb"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />

          <TouchableOpacity
            onPress={handleRegister}
            style={styles.buttonContainer}
            disabled={loading}
          >
            <LinearGradient
              colors={['#f91a89', '#653ef2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginbtn}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
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