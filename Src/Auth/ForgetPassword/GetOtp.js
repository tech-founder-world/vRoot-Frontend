import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { ALERT_TYPE, Toast, Root, Dialog } from 'react-native-alert-notification';
import LinearGradient from 'react-native-linear-gradient';

// ✅ FIX: Correct import paths
import styles from '../../Style/Loginstyle';  // Check if this path is correct
import { API_BASE_URL } from '../../config/config';  // Check if this path is correct


const GetOtp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Validate email
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // ✅ Handle Get OTP
  const handleGetOTP = async () => {
    // Validate email
    if (!email.trim()) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Error',
        textBody: 'Please enter your email address',
      });
      return;
    }

    if (!isValidEmail(email)) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Invalid Email',
        textBody: 'Please enter a valid email address',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('📤 Sending forgot password request for:', email);

      const response = await fetch(`${API_BASE_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      console.log('📥 Forgot password response:', data);

      if (data.success) {
        // ✅ Success - OTP sent
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: '✅ OTP Sent!',
          textBody: 'Check your email for the OTP code',
        });

        // ✅ Navigate to VerifyOTP screen with userId
        navigation.navigate('VerifyOtp', {
          userId: data.userId,
          email: email.trim(),
          isResetPassword: true, // Flag to identify this is for password reset
        });
      } else {
        // ❌ Error
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Failed',
          textBody: data.message || 'User not found. Please check your email.',
        });
      }
    } catch (error) {
      console.error('❌ Forgot password error:', error);
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
        <View style={styles.forgetbox}>
          <Image
            source={require("../../Assests/forget.png")}
            style={styles.forgetpic}
          />

          <Text style={[styles.heading, { fontSize: 24, textAlign: 'center' }]}>
            Forgot Password?
          </Text>
          <Text style={[styles.subheading, { textAlign: 'center', marginTop: 4 }]}>
            Enter your email and we'll send you a code to reset your password
          </Text>

          <TextInput
            style={[styles.input, { marginTop: 20 }]}
            placeholder="Enter Your Email"
            placeholderTextColor="#bbb"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleGetOTP}
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
                <Text style={styles.buttonText}>Get OTP</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("LoginScreen")}
            style={{ marginTop: 10 }}
          >
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
    </Root>
  );
};

export default GetOtp;