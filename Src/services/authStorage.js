import AsyncStorage from '@react-native-async-storage/async-storage';

// SAVE TOKEN
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (error) {
    console.log('Save token error:', error);
  }
};

// GET TOKEN
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.log('Get token error:', error);
  }
};

// SAVE USER
export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.log('Save user error:', error);
  }
};

// GET USER
export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    return JSON.parse(user);
  } catch (error) {
    console.log('Get user error:', error);
  }
};

// LOGOUT
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.log('Logout error:', error);
  }
};