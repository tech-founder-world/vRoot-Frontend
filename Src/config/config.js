export const API_BASE_URL="https://vroot-server.onrender.com"   
// http://10.40.216.181:9091


// API Configuration
// export const API_BASE_URL = 'http://localhost:9091'; // Android emulator ke liye
// export const API_BASE_URL = 'http://10.0.2.2:9091'; // Android emulator
// export const API_BASE_URL = 'http://192.168.x.x:9091'; // Real device (apna IP daalna)

export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: `${API_BASE_URL}/api/users/register`,
        VERIFY_EMAIL: `${API_BASE_URL}/api/users/verify-email`,
        RESEND_OTP: `${API_BASE_URL}/api/users/resend-otp`,
        LOGIN: `${API_BASE_URL}/api/users/login`,
        FORGOT_PASSWORD: `${API_BASE_URL}/api/users/forgot-password`,
        VERIFY_RESET_OTP: `${API_BASE_URL}/api/users/verify-reset-otp`,
        RESET_PASSWORD: `${API_BASE_URL}/api/users/reset-password`,
        LOGOUT: `${API_BASE_URL}/api/users/logout`,
        PROFILE: `${API_BASE_URL}/api/users/profile`,
    }
};