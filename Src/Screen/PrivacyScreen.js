import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const PrivacyScreen = () => {
    const [isPrivate, setIsPrivate] = useState(false);
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

    const handleBlockedUsers = () => {
        Alert.alert("Blocked Users", "Here you can manage your blocked users.");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Privacy & Security</Text>

            {/* Private Account Toggle */}
            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Private Account</Text>
                <Switch 
                    value={isPrivate} 
                    onValueChange={setIsPrivate} 
                    thumbColor={isPrivate ? '#FF007F' : '#E0E0E0'}
                    trackColor={{ false: '#D3D3D3', true: '#FF69B4' }}
                />
            </View>

            {/* Two-Factor Authentication Toggle */}
            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Enable 2FA</Text>
                <Switch 
                    value={isTwoFactorEnabled} 
                    onValueChange={setIsTwoFactorEnabled} 
                    thumbColor={isTwoFactorEnabled ? '#FF007F' : '#E0E0E0'}
                    trackColor={{ false: '#D3D3D3', true: '#FF69B4' }}
                />
            </View>

            {/* Manage Blocked Users */}
            <TouchableOpacity style={styles.button} onPress={handleBlockedUsers}>
                <Text style={styles.buttonText}>Manage Blocked Users</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF007F',
        marginBottom: 20,
        textAlign: 'center',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    settingText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    button: {
        marginTop: 30,
        backgroundColor: '#FF007F',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default PrivacyScreen;
