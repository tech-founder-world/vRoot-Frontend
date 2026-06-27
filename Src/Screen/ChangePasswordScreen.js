import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, 
    Alert, Image, ActivityIndicator, ScrollView, KeyboardAvoidingView,
    Platform
} from 'react-native';
import { ALERT_TYPE, Toast, Root, Dialog } from 'react-native-alert-notification';
import { API_BASE_URL } from '../config/config';
import { getToken } from '../services/authStorage';
import LinearGradient from 'react-native-linear-gradient';

const ChangePasswordScreen = ({ navigation }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');
    const [errors, setErrors] = useState({});

    // ✅ Function to check password strength
    const checkPasswordStrength = (password) => {
        if (!password) {
            setPasswordStrength('');
            return;
        }

        let strength = '';
        let score = 0;

        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (password.match(/[A-Z]/)) score++;
        if (password.match(/[0-9]/)) score++;
        if (password.match(/[\W_]/)) score++;

        if (score <= 2) strength = 'Weak';
        else if (score <= 4) strength = 'Moderate';
        else strength = 'Strong';

        setPasswordStrength(strength);
    };

    // ✅ Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!oldPassword.trim()) {
            newErrors.oldPassword = 'Current password is required';
        }

        if (!newPassword.trim()) {
            newErrors.newPassword = 'New password is required';
        } else if (newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ Handle Change Password
    const handleChangePassword = async () => {
        if (!validateForm()) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Validation Error',
                textBody: 'Please fix the errors before continuing',
            });
            return;
        }

        setLoading(true);

        try {
            const token = await getToken();
            
            if (!token) {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Error',
                    textBody: 'Please login again',
                });
                navigation.navigate('LoginScreen');
                return;
            }

            console.log('📤 Changing password...');
            console.log('📍 API URL:', `${API_BASE_URL}/api/users/change-password`);

            const response = await fetch(`${API_BASE_URL}/api/users/change-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                }),
            });

            const data = await response.json();
            console.log('📥 Change password response:', data);

            if (data.success) {
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: '✅ Password Changed!',
                    message: 'Your password has been updated successfully.',
                    button: 'Done',
                    onPressButton: () => {
                        Dialog.hide();
                        navigation.goBack();
                    },
                });

                // Clear fields
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setPasswordStrength('');
                setErrors({});
            } else {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Failed',
                    textBody: data.message || 'Failed to change password. Please check your current password.',
                });
            }
        } catch (error) {
            console.error('❌ Change Password Error:', error);
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Unable to connect to the server. Please check your internet connection.',
            });
        } finally {
            setLoading(false);
        }
    };

    // ✅ Get strength color
    const getStrengthColor = () => {
        if (passwordStrength === 'Weak') return '#FF3B30';
        if (passwordStrength === 'Moderate') return '#FF9500';
        if (passwordStrength === 'Strong') return '#34C759';
        return '#555';
    };

    // ✅ Get strength progress
    const getStrengthProgress = () => {
        if (passwordStrength === 'Weak') return 33;
        if (passwordStrength === 'Moderate') return 66;
        if (passwordStrength === 'Strong') return 100;
        return 0;
    };

    return (
        <Root>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Back Button */}
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()} 
                        style={styles.backButton}
                    >
                        <Image 
                            source={require('../Assests/back.png')} 
                            style={styles.backIcon} 
                        />
                    </TouchableOpacity>

                    {/* Header */}
                    <Text style={styles.header}>🔐 Change Password</Text>

                    {/* Description */}
                    <Text style={styles.description}>
                        To keep your account secure, we recommend updating your password regularly.
                        Choose a strong password that you haven't used before.
                    </Text>

                    {/* Old Password Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Current Password</Text>
                        <View style={[styles.inputContainer, errors.oldPassword && styles.inputError]}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your current password"
                                secureTextEntry={!showOldPassword}
                                placeholderTextColor="#666"
                                value={oldPassword}
                                onChangeText={(text) => {
                                    setOldPassword(text);
                                    setErrors({ ...errors, oldPassword: '' });
                                }}
                                editable={!loading}
                            />
                            <TouchableOpacity 
                                onPress={() => setShowOldPassword(!showOldPassword)}
                                style={styles.eyeButton}
                            >
                                <Image
                                    source={showOldPassword ? require('../Assests/view.png') : require('../Assests/close.png')}
                                    style={styles.eyeIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.oldPassword && (
                            <Text style={styles.errorText}>{errors.oldPassword}</Text>
                        )}
                    </View>

                    {/* New Password Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>New Password</Text>
                        <View style={[styles.inputContainer, errors.newPassword && styles.inputError]}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your new password"
                                secureTextEntry={!showNewPassword}
                                placeholderTextColor="#666"
                                value={newPassword}
                                onChangeText={(text) => {
                                    setNewPassword(text);
                                    checkPasswordStrength(text);
                                    setErrors({ ...errors, newPassword: '' });
                                }}
                                editable={!loading}
                            />
                            <TouchableOpacity 
                                onPress={() => setShowNewPassword(!showNewPassword)}
                                style={styles.eyeButton}
                            >
                                <Image
                                    source={showNewPassword ? require('../Assests/view.png') : require('../Assests/close.png')}
                                    style={styles.eyeIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.newPassword && (
                            <Text style={styles.errorText}>{errors.newPassword}</Text>
                        )}
                    </View>

                    {/* Password Strength Indicator */}
                    {passwordStrength ? (
                        <View style={styles.strengthContainer}>
                            <View style={styles.strengthBar}>
                                <View 
                                    style={[
                                        styles.strengthProgress, 
                                        { 
                                            width: `${getStrengthProgress()}%`,
                                            backgroundColor: getStrengthColor()
                                        }
                                    ]} 
                                />
                            </View>
                            <Text style={[
                                styles.strengthText,
                                { color: getStrengthColor() }
                            ]}>
                                {passwordStrength} Password
                            </Text>
                        </View>
                    ) : null}

                    {/* Confirm Password Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Confirm New Password</Text>
                        <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm your new password"
                                secureTextEntry={!showConfirmPassword}
                                placeholderTextColor="#666"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    setErrors({ ...errors, confirmPassword: '' });
                                }}
                                editable={!loading}
                            />
                            <TouchableOpacity 
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeButton}
                            >
                                <Image
                                    source={showConfirmPassword ? require('../Assests/view.png') : require('../Assests/close.png')}
                                    style={styles.eyeIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.confirmPassword && (
                            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                        )}
                    </View>

                    {/* Password Requirements */}
                    <View style={styles.requirementsContainer}>
                        <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                        <View style={styles.requirementRow}>
                            <Text style={[
                                styles.requirementText,
                                newPassword.length >= 6 && styles.requirementMet
                            ]}>
                                {newPassword.length >= 6 ? '✅' : '❌'} At least 6 characters
                            </Text>
                        </View>
                        <View style={styles.requirementRow}>
                            <Text style={[
                                styles.requirementText,
                                newPassword.match(/[A-Z]/) && styles.requirementMet
                            ]}>
                                {newPassword.match(/[A-Z]/) ? '✅' : '❌'} At least one uppercase letter
                            </Text>
                        </View>
                        <View style={styles.requirementRow}>
                            <Text style={[
                                styles.requirementText,
                                newPassword.match(/[0-9]/) && styles.requirementMet
                            ]}>
                                {newPassword.match(/[0-9]/) ? '✅' : '❌'} At least one number
                            </Text>
                        </View>
                        <View style={styles.requirementRow}>
                            <Text style={[
                                styles.requirementText,
                                newPassword.match(/[\W_]/) && styles.requirementMet
                            ]}>
                                {newPassword.match(/[\W_]/) ? '✅' : '❌'} At least one special character
                            </Text>
                        </View>
                    </View>

                    {/* Update Button */}
                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleChangePassword}
                        disabled={loading}
                    >
                        <LinearGradient
                            colors={['#f91a89', '#653ef2']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientButton}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Update Password</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Security Tips */}
                    <View style={styles.tipsContainer}>
                        <Text style={styles.tipsTitle}>💡 Security Tips</Text>
                        <Text style={styles.tipText}>• Use a unique password for each account</Text>
                        <Text style={styles.tipText}>• Avoid using personal information</Text>
                        <Text style={styles.tipText}>• Use a mix of letters, numbers, and symbols</Text>
                        <Text style={styles.tipText}>• Change your password regularly</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Root>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 50,
        paddingBottom: 30,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        marginBottom: 10,
    },
    backIcon: {
        width: 25,
        height: 25,
        tintColor: '#FF007F',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF007F',
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
        color: '#999',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 20,
        paddingHorizontal: 5,
    },
    inputWrapper: {
        marginBottom: 16,
    },
    inputLabel: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        paddingHorizontal: 14,
        borderWidth: 1.5,
        borderColor: '#333',
    },
    inputError: {
        borderColor: '#FF3B30',
    },
    input: {
        flex: 1,
        color: '#fff',
        paddingVertical: 14,
        fontSize: 15,
    },
    eyeButton: {
        padding: 8,
    },
    eyeIcon: {
        width: 22,
        height: 22,
        tintColor: '#FF007F',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    strengthContainer: {
        marginBottom: 16,
        marginTop: 4,
    },
    strengthBar: {
        height: 4,
        backgroundColor: '#2a2a2a',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 4,
    },
    strengthProgress: {
        height: '100%',
        borderRadius: 2,
    },
    strengthText: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'right',
    },
    requirementsContainer: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 14,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#2a2a2a',
    },
    requirementsTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 8,
    },
    requirementRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3,
    },
    requirementText: {
        color: '#666',
        fontSize: 13,
    },
    requirementMet: {
        color: '#34C759',
    },
    button: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    gradientButton: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },
    tipsContainer: {
        backgroundColor: 'rgba(255,0,127,0.08)',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,0,127,0.2)',
    },
    tipsTitle: {
        color: '#FF007F',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 6,
    },
    tipText: {
        color: '#999',
        fontSize: 12,
        paddingVertical: 2,
        lineHeight: 18,
    },
});

export default ChangePasswordScreen;