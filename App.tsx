import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './Src/Navigation/AppNavigation';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) setIsLoggedIn(true);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  if (loading) return null;

  return (
    // ✅ Sirf AppNavigation use karo — Stack + Tab dono iske andar hain
    // ✅ isLoggedIn AppNavigation ko pass karo taaki sahi screen pe start ho
    <NavigationContainer>
      <AppNavigation isLoggedIn={isLoggedIn} />
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});