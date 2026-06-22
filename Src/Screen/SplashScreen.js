import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {

    const token = await AsyncStorage.getItem('token');

    setTimeout(() => {

      if (token) {
        navigation.replace('TabNavigation');
      } else {
        navigation.replace('LoginScreen');
      }

    }, 1500);
  };

  return (
    <View style={{
      flex:1,
      justifyContent:'center',
      alignItems:'center'
    }}>
      <ActivityIndicator size="large" color="red" />

      <Text>hello vRooT User</Text>
    </View>
  );
};

export default SplashScreen;