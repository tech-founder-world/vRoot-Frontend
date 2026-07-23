import React, { useState, useRef, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { ALERT_TYPE, Toast, Root, Dialog } from 'react-native-alert-notification';
import { API_BASE_URL } from '../../config/config';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../Style/Loginstyle';

const VerifyOtpScreen = ({ navigation, route }) => {
  // ✅ Get params from route
  const { userId, email, isResetPassword } = route.params || {};
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // ✅ Timer for resend OTP
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [timer]);

  // ✅ Handle OTP input change
  const handleOtpChange = (text, index) => {
    if (text && !/^[0-9]$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (text && index === 5) {
      const otpString = newOtp.join('');
      if (otpString.length === 6) {
        setTimeout(() => handleVerify(otpString), 300);
      }
    }
  };

  // ✅ Handle backspace
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ✅ Verify OTP
  const handleVerify = async (otpCode) => {
    if (otpCode.length < 6) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Incomplete OTP',
        textBody: 'Please enter all 6 digits',
      });
      return;
    }

    if (!userId) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'User ID not found. Please try again.',
      });
      navigation.navigate('LoginScreen');
      return;
    }

    setLoading(true);

    try {
      console.log('📤 Verifying OTP for user:', userId);
      console.log('📤 Is Reset Password:', isResetPassword);
      
      // ✅ Different API endpoints based on flow
      const endpoint = isResetPassword 
        ? '/api/users/verify-reset-otp' 
        : '/api/users/verify-email';
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          otp: otpCode,
        }),
      });

      const data = await response.json();
      console.log('📥 Verify OTP response:', data);

      if (data.success) {
        if (isResetPassword) {
          // ✅ For Reset Password - Navigate to Reset Password Screen
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: '✅ OTP Verified!',
            message: 'Proceed to reset your password.',
            button: 'Reset Password',
            onPressButton: () => {
              Dialog.hide();
              navigation.navigate('ResetPassword', { userId });
            },
          });
        } else {
          // ✅ For Email Verification - Navigate to Login
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: '✅ Email Verified!',
            message: 'Your account has been verified successfully.',
            button: 'Go to Login',
            onPressButton: () => {
              Dialog.hide();
              navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
              });
            },
          });
        }
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Verification Failed',
          textBody: data.message || 'Invalid OTP. Please try again.',
        });
        
        // Clear OTP on failure
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('❌ Verify error:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Unable to verify OTP. Please check your connection.',
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Resend OTP
  const handleResendOTP = async () => {
    if (!canResend) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Wait',
        textBody: `Please wait ${timer} seconds before resending`,
      });
      return;
    }

    if (!userId) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'User ID not found. Please try again.',
      });
      navigation.navigate('LoginScreen');
      return;
    }

    setResendLoading(true);

    try {
      console.log('📤 Resending OTP for user:', userId);
      
      // ✅ Different endpoints for resend
      const endpoint = isResetPassword
        ? '/api/users/forgot-password'
        : '/api/users/resend-otp';
      
      const body = isResetPassword
        ? { email: email }
        : { userId: userId };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        setTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();

        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: '✅ OTP Sent',
          textBody: 'New OTP has been sent to your email.',
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Failed',
          textBody: data.message || 'Failed to resend OTP.',
        });
      }
    } catch (error) {
      console.error('❌ Resend error:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Unable to resend OTP.',
      });
    } finally {
      setResendLoading(false);
    }
  };

  // ✅ Navigate back
  const handleBack = () => {
    if (isResetPassword) {
      navigation.navigate('LoginScreen');
    } else {
      navigation.navigate('RegisterScreen');
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
            source={require("../../Assests/verify.png")}
            style={styles.forgetpic}
          />

          <Text style={[styles.heading, { fontSize: 24, textAlign: 'center' }]}>
            {isResetPassword ? 'Reset Password' : 'Verify Email'}
          </Text>
          <Text style={[styles.subheading, { textAlign: 'center', marginBottom: 10 }]}>
            Enter the 6-digit code sent to
          </Text>
          <Text style={[styles.subheading, { 
            color: '#fff', 
            fontWeight: 'bold', 
            textAlign: 'center',
            marginBottom: 20,
            fontSize: 16,
          }]}>
            {email || 'your email'}
          </Text>

          {/* ✅ OTP Input Boxes */}
          <View style={otpStyles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => inputRefs.current[index] = ref}
                style={[
                  otpStyles.otpInput,
                  digit && otpStyles.otpInputFilled,
                  loading && otpStyles.otpInputDisabled,
                ]}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                placeholder="-"
                placeholderTextColor="rgba(255,255,255,0.3)"
                editable={!loading}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* ✅ Timer / Resend */}
          <View style={otpStyles.resendContainer}>
            <Text style={otpStyles.resendText}>Didn't receive code? </Text>
            {!canResend ? (
              <Text style={otpStyles.timerText}>
                Resend in {timer}s
              </Text>
            ) : (
              <TouchableOpacity 
                onPress={handleResendOTP} 
                disabled={resendLoading}
              >
                <Text style={otpStyles.resendLink}>
                  {resendLoading ? 'Sending...' : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ✅ Verify Button */}
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => handleVerify(otp.join(''))}
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
                <Text style={styles.buttonText}>
                  {isResetPassword ? 'Verify & Reset' : 'Verify OTP'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* ✅ Back Button */}
          <TouchableOpacity
            onPress={handleBack}
            style={{ marginTop: 15 }}
            disabled={loading}
          >
            <Text style={[styles.registerText, { color: '#bbb' }]}>
              {isResetPassword ? '← Back to Login' : '← Back to Register'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Root>
  );
};

// ✅ OTP Specific Styles
const otpStyles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    gap: 8,
  },
  otpInput: {
    width: 46,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '700',
  },
  otpInputFilled: {
    borderColor: '#f91a89',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  otpInputDisabled: {
    opacity: 0.5,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  resendText: {
    color: '#bbb',
    fontSize: 14,
  },
  timerText: {
    color: '#f91a89',
    fontSize: 14,
    fontWeight: '600',
  },
  resendLink: {
    color: '#f91a89',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default VerifyOtpScreen;