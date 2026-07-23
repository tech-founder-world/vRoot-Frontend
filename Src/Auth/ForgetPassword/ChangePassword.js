import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { ALERT_TYPE, Toast, Root, Dialog } from 'react-native-alert-notification';
import { API_BASE_URL } from '../../config/config';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../Style/Loginstyle';

const ResetPasswordScreen = ({ navigation, route }) => {
  const { userId } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Please fill all fields',
      });
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Too Short',
        textBody: 'Password must be at least 6 characters',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Passwords do not match',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('📤 Resetting password for user:', userId);

      const response = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();
      console.log('📥 Reset password response:', data);

      if (data.success) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: '✅ Password Reset!',
          message: 'Your password has been changed successfully.',
          button: 'Go to Login',
          onPressButton: () => {
            Dialog.hide();
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            });
          },
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Failed',
          textBody: data.message || 'Failed to reset password',
        });
      }
    } catch (error) {
      console.error('❌ Reset password error:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Unable to connect to the server.',
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
            source={require("../../Assests/menu.png")}
            style={styles.forgetpic}
          />

          <Text style={[styles.heading, { fontSize: 24, textAlign: 'center' }]}>
            Reset Password
          </Text>
          <Text style={[styles.subheading, { textAlign: 'center', marginBottom: 20 }]}>
            Create a new password for your account
          </Text>

          <TextInput
            style={[styles.input, { marginBottom: 16 }]}
            placeholder="New Password"
            placeholderTextColor="#bbb"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            editable={!loading}
          />

          <TextInput
            style={[styles.input, { marginBottom: 20 }]}
            placeholder="Confirm New Password"
            placeholderTextColor="#bbb"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
          />

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleResetPassword}
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
                <Text style={styles.buttonText}>Reset Password</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('LoginScreen')}
            style={{ marginTop: 15 }}
          >
            <Text style={styles.registerText}>
              ← Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Root>
  );
};

export default ResetPasswordScreen;