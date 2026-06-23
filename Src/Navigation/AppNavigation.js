import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

import LoginScreen from '../Auth/LoginScreen';
import RegisterScreen from '../Auth/RegisterScreen';
import HomeScreen from '../Screen/HomeScreen';
import EditScreen from '../Screen/EditScreen';
import ProfileScreen from '../Screen/ProfileScreen';
import TabNavigation from '../Navigation/TabNavigation';
import SettingScreen from '../Screen/SettingScreen';
import PrivacyScreen from '../Screen/PrivacyScreen';
import ChangePasswordScreen from '../Screen/ChangePasswordScreen';
import VideoDetailScreen from '../futureEnhance/VideoDetailScreen';
import UploadReelScreen from '../Screen/UploadReelScreen';
import SplashScreen from '../Screen/SplashScreen';
import OtherProfile from '../Screen/OtherProfile';
import ReelsScreen from '../Screen/ReelsScreen';
import UploadPostScreen from '../Screen/UploadPostScreen'
import GetOtp from '../Auth/ForgetPassword/GetOtp';
import VerifyOtp from '../Auth/ForgetPassword/VerifyOtp';
import ChangePassword from '../Auth/ForgetPassword/ChangePassword';

enableScreens();

const Stack = createNativeStackNavigator();

const AppNavigation = ({ isLoggedIn }) => {
  return (
    <Stack.Navigator
      // ✅ isLoggedIn ke basis pe initial screen decide hogi
      initialRouteName={isLoggedIn ? 'TabNavigation' : 'Splash'}
    >
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />

      {/* ✅ TabNavigation Stack ke andar hai — isliye UploadReel navigate ho sakta hai */}
      <Stack.Screen name="TabNavigation" component={TabNavigation} options={{ headerShown: false }} />

      <Stack.Screen name="EditScreen" component={EditScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PrivacyScreen" component={PrivacyScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VideoDetailScreen" component={VideoDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OtherProfile" component={OtherProfile} options={{ headerShown: false }} />
      <Stack.Screen name="ReelsScreen" component={ReelsScreen} options={{ headerShown: false }} />

      {/* ✅ Ye dono Stack mein hain — Tab ke andar se bhi navigate hoga */}
      {/* upload kregi post or reel */}
      <Stack.Screen name="UploadReel" component={UploadReelScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UploadScreen" component={UploadPostScreen} options={{ headerShown: false }} />
  
      <Stack.Screen name="Getotp"component={GetOtp} options={{headerShown:false}}/>
      <Stack.Screen name="Verifyotp"component={VerifyOtp} options={{headerShown:false}}/>
      <Stack.Screen name="changepassword"component={ChangePassword} options={{headerShown:false}}/>
   
    </Stack.Navigator>
  );
};

export default AppNavigation;