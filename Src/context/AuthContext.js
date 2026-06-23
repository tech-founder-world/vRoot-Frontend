import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    registerUser, 
    verifyEmail, 
    resendOTP, 
    loginUser, 
    forgotPassword, 
    verifyResetOTP, 
    resetPassword,
    logoutUser 
} from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load user data on app start
    useEffect(() => {
        loadStoredData();
    }, []);

    const loadStoredData = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('@auth_token');
            const storedUser = await AsyncStorage.getItem('@auth_user');
            
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error loading auth data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Register
    const register = async (userData) => {
        try {
            const response = await registerUser(userData);
            if (response.success) {
                // Store userId temporarily for OTP verification
                await AsyncStorage.setItem('@temp_user_id', response.userId);
                await AsyncStorage.setItem('@temp_user_email', response.email);
            }
            return response;
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, message: 'Registration failed' };
        }
    };

    // Verify Email
    const verify = async (userId, otp) => {
        try {
            const response = await verifyEmail(userId, otp);
            if (response.success) {
                // Save token and user
                await AsyncStorage.setItem('@auth_token', response.token);
                await AsyncStorage.setItem('@auth_user', JSON.stringify(response.user));
                
                // Clear temp data
                await AsyncStorage.removeItem('@temp_user_id');
                await AsyncStorage.removeItem('@temp_user_email');
                
                setToken(response.token);
                setUser(response.user);
                setIsAuthenticated(true);
            }
            return response;
        } catch (error) {
            console.error('Verify email error:', error);
            return { success: false, message: 'Verification failed' };
        }
    };

    // Resend OTP
    const resend = async (userId) => {
        try {
            return await resendOTP(userId);
        } catch (error) {
            console.error('Resend OTP error:', error);
            return { success: false, message: 'Failed to resend OTP' };
        }
    };

    // Login
    const login = async (email, password) => {
        try {
            const response = await loginUser(email, password);
            if (response.success) {
                await AsyncStorage.setItem('@auth_token', response.token);
                await AsyncStorage.setItem('@auth_user', JSON.stringify(response.user));
                
                setToken(response.token);
                setUser(response.user);
                setIsAuthenticated(true);
            }
            return response;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Login failed' };
        }
    };

    // Forgot Password
    const forgot = async (email) => {
        try {
            const response = await forgotPassword(email);
            if (response.success) {
                await AsyncStorage.setItem('@reset_user_id', response.userId);
            }
            return response;
        } catch (error) {
            console.error('Forgot password error:', error);
            return { success: false, message: 'Failed to send OTP' };
        }
    };

    // Verify Reset OTP
    const verifyReset = async (userId, otp) => {
        try {
            return await verifyResetOTP(userId, otp);
        } catch (error) {
            console.error('Verify reset OTP error:', error);
            return { success: false, message: 'Verification failed' };
        }
    };

    // Reset Password
    const reset = async (userId, newPassword) => {
        try {
            const response = await resetPassword(userId, newPassword);
            if (response.success) {
                await AsyncStorage.removeItem('@reset_user_id');
            }
            return response;
        } catch (error) {
            console.error('Reset password error:', error);
            return { success: false, message: 'Password reset failed' };
        }
    };

    // Logout
    const logout = async () => {
        try {
            if (token) {
                await logoutUser(token);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
        
        await AsyncStorage.removeItem('@auth_token');
        await AsyncStorage.removeItem('@auth_user');
        
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    // Update user
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        AsyncStorage.setItem('@auth_user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        register,
        verify,
        resend,
        login,
        forgot,
        verifyReset,
        reset,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};