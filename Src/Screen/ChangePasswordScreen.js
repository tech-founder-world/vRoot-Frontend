import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image
} from 'react-native';

const ChangePasswordScreen = ({ navigation }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    // Function to check password strength
    const checkPasswordStrength = (password) => {
        if (!password) {
            setPasswordStrength('');
            return;
        }

        let strength = '';
        if (password.length < 6) {
            strength = 'Weak';
        } else if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.match(/[\W_]/)) {
            strength = 'Strong';
        } else {
            strength = 'Moderate';
        }

        setPasswordStrength(strength);
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/:id/preferences`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await response.json();
            if (data.success) {
                Alert.alert("Success", "Password changed successfully!");
                navigation.goBack();
            } else {
                Alert.alert("Error", data.message || "Failed to change password.");
            }
        } catch (error) {
            console.error("Change Password Error:", error);
            Alert.alert("Error", "Something went wrong.");
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image source={require('../Assests/back.png')} style={styles.backIcon} />
            </TouchableOpacity>

            <Text style={styles.header}>Change Password</Text>

            {/* Description Section */}
            <Text style={styles.description}>
                To keep your account secure, we recommend updating your password regularly.
                Choose a strong password that you haven't used before.
            </Text>

            {/* Old Password Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your current password"
                    secureTextEntry={!showOldPassword}
                    placeholderTextColor="#aaa"
                    value={oldPassword}
                    onChangeText={setOldPassword}
                />
                <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
                    <Image
                        source={showOldPassword ? require('../Assests/view.png') : require('../Assests/close.png')}
                        style={styles.eyeIcon}
                    />
                </TouchableOpacity>
            </View>

            {/* New Password Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your new password"
                    secureTextEntry={!showNewPassword}
                    placeholderTextColor="#aaa"
                    value={newPassword}
                    onChangeText={(text) => {
                        setNewPassword(text);
                        checkPasswordStrength(text);
                    }}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Image
                        source={showNewPassword ? require('../Assests/view.png') : require('../Assests/close.png')}
                        style={styles.eyeIcon}
                    />
                </TouchableOpacity>
            </View>

            {/* Password Strength Indicator */}
            {passwordStrength ? (
                <Text style={[styles.strengthText, 
                    passwordStrength === 'Weak' ? styles.weak : 
                    passwordStrength === 'Moderate' ? styles.moderate : styles.strong
                ]}>
                    {passwordStrength} Password
                </Text>
            ) : null}

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm your new password"
                    secureTextEntry={!showConfirmPassword}
                    placeholderTextColor="#aaa"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Image
                        source={showConfirmPassword ? require('../Assests/view.png') : require('../Assests/close.png')}
                        style={styles.eyeIcon}
                    />
                </TouchableOpacity>
            </View>

            {/* Update Button */}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleChangePassword}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update Password'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    backIcon: {
        width: 25,
        height: 25,
        tintColor: '#FF007F',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF007F',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        color: '#bbb',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#222',
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF007F',
    },
    input: {
        flex: 1,
        color: '#fff',
        paddingVertical: 12,
    },
    eyeIcon: {
        width: 25,
        height: 25,
        tintColor: '#FF007F',
    },
    strengthText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: '600',
    },
    weak: {
        color: 'red',
    },
    moderate: {
        color: 'orange',
    },
    strong: {
        color: 'green',
    },
    button: {
        backgroundColor: '#FF007F',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#888',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ChangePasswordScreen;
