import { API_ENDPOINTS } from '../config/config';

// Register User
export const registerUser = async (userData) => {
    try {
        const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return await response.json();
    } catch (error) {
        console.error('Register API error:', error);
        return { success: false, message: 'Network error' };
    }
};

// Verify Email OTP
export const verifyEmail = async (userId, otp) => {
    try {
        const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, otp }),
        });
        return await response.json();
    } catch (error) {
        console.error('Verify email API error:', error);
        return { success: false, message: 'Network error' };
    }
};

// Resend OTP
export const resendOTP = async (userId) => {
    try {
        const response = await fetch(API_ENDPOINTS.AUTH.RESEND_OTP, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });
        return await response.json();
    } catch (error) {
        console.error('Resend OTP API error:', error);
        return { success: false, message: 'Network error' };
    }
};

// Login
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        return await response.json();
    } catch (error) {
        console.error('Login API error:', error);
        return { success: false, message: 'Network error' };
    }
};

// Forgot Password - Send OTP
export const forgotPassword = async (email) => {
    try {
        const response = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        return await response.json();
    } catch (error) {
        console.error('Forgot password API error:', error);
        return { success: false, message: 'Network error' };
    }
};

// Verify Reset OTP
export const verifyResetOTP = async (userId, otp) => {
    try {
        const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_RESET_OTP, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, otp }),
        });
        return await response.json();
    } catch (error) {
        console.error('Verify reset OTP API error:', error);
        return { success: false, message: 'Network error' };
    }
};

// Reset Password
export const resetPassword = async (userId, newPassword) => {
    try {
        const response = await fetch(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, newPassword }),
        });
        return await response.json();
    } catch (error) {
        console.error('Reset password API error:', error);
        return { success: false, message: 'Network error' };
    }
};

// Logout
export const logoutUser = async (token) => {
    try {
        const response = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Logout API error:', error);
        return { success: false, message: 'Network error' };
    }
};