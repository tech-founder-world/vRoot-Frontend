import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Switch, Alert,
<<<<<<< HEAD
  Image,ScrollView
=======
  Image
>>>>>>> 1bb68de13429fb35a414c7b06255629cef33c84e
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  API_BASE_URL  from '../config/config';

import { logoutUser } from '../services/authStorage';
<<<<<<< HEAD
import LinearGradient from 'react-native-linear-gradient';
import styles from '../Style/Loginstyle';

const SettingsScreen = ({ navigation }) => {
  const [isPrivate,setIsPrivate]=useState("")
=======
const SettingsScreen = ({ navigation }) => {
>>>>>>> 1bb68de13429fb35a414c7b06255629cef33c84e
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [userId, setUserId] = useState(null);

  // Fetch userId from AsyncStorage
  React.useEffect(() => {
    AsyncStorage.getItem('userId').then(id => setUserId(id));
  }, []);

  const toggleNotifications = async () => {
    setNotificationsEnabled(!notificationsEnabled);
    await fetch(`${API_BASE_URL}/${userId}/preferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notifications: !notificationsEnabled }),
    });
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Logout Function
  // const handleLogout = () => {
  //   // const navigation = useNavigation(); // Ensure navigation is available
  //   Alert.alert('Logout', 'Are you sure you want to logout?', [
  //     { text: 'Cancel', style: 'cancel' },
  //     {
  //       text: 'Logout', onPress: async () => {
  //         try {
  //           const response = await fetch(`${API_BASE_URL}/api/users/logout`, { method: 'POST' });

  //           if (!response.ok) {
  //             throw new Error('Failed to log out');
  //           }

  //           await AsyncStorage.removeItem('userId'); // Clear stored user data
  //           navigation.replace('LoginScreen'); // Redirect to login screen
  //         } catch (error) {
  //           Alert.alert('Error', 'Logout failed. Please try again.');
  //           console.error('Logout error:', error);
  //         }
  //       }
  //     },
  //   ]);
  //   console.log(navigation.getState())
  // }

  const handleLogout = async () => {

  await logoutUser();

  navigation.replace('LoginScreen');
};

  // Delete Account Function
  const deleteAccount = async (email, navigation) => {
    Alert.alert(
      'Delete Account', 
      'This action is irreversible. Do you want to proceed?', 
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/api/user/deleteByEmail`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
              });
  
              const data = await response.json();
  
              if (response.ok) {
                Alert.alert('Success', data.message, [
                  { text: 'OK', onPress: () => navigation.replace('RegisterScreen') } // Redirect user after deletion
                ]);
              } else {
                Alert.alert('Error', data.message);
              }
            } catch (error) {
              console.error("Error:", error);
              Alert.alert('Error', "Failed to delete account. Please try again.");
            }
          }
        }
      ]
    );
  };
  

  return (
<<<<<<< HEAD
    <ScrollView>
    <LinearGradient 
            colors={['#a90657', '#2b09a6']}
            style={styles.container}>
    <View>
      <Text style={styles.header}>Personal Information</Text>
=======
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
>>>>>>> 1bb68de13429fb35a414c7b06255629cef33c84e

      {/* Profile Settings */}
      {/* <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('EditProfile')}>
        <Image source={require('../Assests/bell.png')}  style={{ height:18,width:18,tintColor:'#FF007F'}}   />
        <Text style={styles.settingText}>Edit Profile</Text>
      </TouchableOpacity> */}

      {/* Privacy & Security */}
<<<<<<< HEAD
      <View style={styles.settingbox}>

     <View style={styles.settingItem}>
        <Image source={require('../Assests/padlock.png')} style={{ height: 18, width: 18, tintColor: '#FF007F' }} />
        <Text style={styles.settingText}>Private Account</Text>
                   <Switch
                     value={isPrivate}
                     onValueChange={setIsPrivate}
                     thumbColor={isPrivate ? '#FF007F' : '#ccc'}
                     trackColor={{
                       false: '#333',
                       true: '#FF007F'
                     }}
                   />
     
                 </View>
     

=======
      <TouchableOpacity style={styles.settingItem} onPress={()=>navigation.navigate('PrivacyScreen')}>
        <Image source={require('../Assests/secure.png')} style={{ height: 18, width: 18, tintColor: '#FF007F' }} />
        <Text style={styles.settingText}>Privacy & Security</Text>
      </TouchableOpacity>

      {/* Change Password */}
>>>>>>> 1bb68de13429fb35a414c7b06255629cef33c84e
      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ChangePasswordScreen')}>
        <Image source={require('../Assests/lock.png')} style={{ height: 18, width: 18, tintColor: '#FF007F' }} />
        <Text style={styles.settingText}>Change Password</Text>
      </TouchableOpacity>

<<<<<<< HEAD
      <TouchableOpacity style={styles.settingItem} onPress={deleteAccount}>
        <Image source={require('../Assests/bin.png')} style={{ height: 18, width: 18, tintColor: '#FF007F' }} />
        <Text style={styles.settingText}>Delete Account</Text>
      </TouchableOpacity>

      </View>

      <Text style={styles.header}> General Setting</Text>

       <View style={styles.settingbox}>

=======
      {/* Notifications Toggle */}
>>>>>>> 1bb68de13429fb35a414c7b06255629cef33c84e
      <View style={styles.settingItem}>
        <Image source={require('../Assests/bell.png')} style={{ height: 18, width: 18, tintColor: '#FF007F' }} />
        <Text style={styles.settingText}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          thumbColor={darkMode ? '#FF007F' : '#E0E0E0'}
          trackColor={{ false: '#D3D3D3', true: '#FF69B4' }}
          style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }} // Slightly enlarges the switch
        />
<<<<<<< HEAD

      </View>

    <View style={styles.settingItem}>
        <Image source={require('../Assests/add-friend.png')} style={{ height: 18, width: 18, tintColor: '#FF007F' }} />
        <Text style={styles.settingText}>Active Status</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          thumbColor={darkMode ? '#FF007F' : '#E0E0E0'}
          trackColor={{ false: '#D3D3D3', true: '#FF69B4' }}
          style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }} // Slightly enlarges the switch
        />
        
      </View>

      </View>

      {/* Notifications Toggle */}
      {/* <View style={styles.settingItem}>
        <Image source={require('../Assests/bell.png')} style={{ height: 18, width: 18, tintColor: '#FF007F' }} />
        <Text style={styles.settingText}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          thumbColor={darkMode ? '#FF007F' : '#E0E0E0'}
          trackColor={{ false: '#D3D3D3', true: '#FF69B4' }}
          style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }} // Slightly enlarges the switch
        />
      </View> */}

      {/* Theme Toggle */}
      {/* <View style={styles.settingItem}>
=======
      </View>

      {/* Theme Toggle */}
      <View style={styles.settingItem}>
>>>>>>> 1bb68de13429fb35a414c7b06255629cef33c84e
        <Image source={require('../Assests/dark.png')} style={{ height: 18, width: 18, tintColor: '#FF007F' }} />
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={toggleDarkMode}
          thumbColor={darkMode ? '#FF007F' : '#E0E0E0'}
          trackColor={{ false: '#D3D3D3', true: '#FF69B4' }}
          style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }} // Slightly enlarges the switch
        />
<<<<<<< HEAD
      </View> */}

            <Text style={styles.header}>App Security</Text>
                   <View style={styles.settingbox}>

      <TouchableOpacity style={styles.settingItem} onPress={()=>navigation.navigate('PrivacyScreen')}>
        <Image source={require('../Assests/secure.png')} style={{ height: 18, width: 18, tintColor: '#FF007F' }} />
        <Text style={styles.settingText}>Privacy & Security</Text>
      </TouchableOpacity>
=======
      </View>
>>>>>>> 1bb68de13429fb35a414c7b06255629cef33c84e

      {/* Help & Support */}
      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Support')}>
        <Image source={require('../Assests/help.png')} style={{ height: 18, width: 18, tintColor: '#FF007F' }} />
        <Text style={styles.settingText}>Help & Support</Text>
      </TouchableOpacity>

<<<<<<< HEAD
      {/* Help & Support */}
      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Support')}>
        <Image source={require('../Assests/help.png')} style={{ height: 18, width: 18, tintColor: '#FF007F' }} />
        <Text style={styles.settingText}>Terms & Condition</Text>
      </TouchableOpacity>

       <View style={styles.settingbox}>

=======
>>>>>>> 1bb68de13429fb35a414c7b06255629cef33c84e
      {/* About App */}
      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('About')}>
        <Image source={require('../Assests/about.png')} style={{ height: 18, width: 18, tintColor: '#FF007F' }} />
        <Text style={styles.settingText}>About vRoot</Text>
      </TouchableOpacity>

<<<<<<< HEAD
      </View>
      </View>

=======
>>>>>>> 1bb68de13429fb35a414c7b06255629cef33c84e
      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Delete Account */}
      <TouchableOpacity style={styles.deleteButton} onPress={deleteAccount}>
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
<<<<<<< HEAD
    </LinearGradient>
    </ScrollView>
  );
};

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#121212', padding: 20 },
//   header: { fontSize: 24, fontWeight: 'bold', color: '#FF007F', marginBottom: 20, textAlign: 'center' },
//   settingItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   settingText: { fontSize: 18, color: '#fff', marginLeft: 15, flex: 1 },
//   logoutButton: { marginTop: 50, backgroundColor: '#FF007F', padding: 12, borderRadius: 10, alignItems: 'center' },
//   logoutText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
//   deleteButton: { marginTop: 15, backgroundColor: '#ff4444', padding: 12, borderRadius: 10, alignItems: 'center' },
//   deleteText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },

// });
=======
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#FF007F', marginBottom: 20, textAlign: 'center' },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingText: { fontSize: 18, color: '#fff', marginLeft: 15, flex: 1 },
  logoutButton: { marginTop: 50, backgroundColor: '#FF007F', padding: 12, borderRadius: 10, alignItems: 'center' },
  logoutText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  deleteButton: { marginTop: 15, backgroundColor: '#ff4444', padding: 12, borderRadius: 10, alignItems: 'center' },
  deleteText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
});
>>>>>>> 1bb68de13429fb35a414c7b06255629cef33c84e

export default SettingsScreen;
