import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';

import { API_BASE_URL } from '../config/config';
import { getToken } from '../services/authStorage';

const EditScreen = ({ navigation, route }) => {

  const existingUser = route.params?.user || {};

  // ✅ Cloudinary URL already poora https link hota hai.
  // Sirf purane local-path format ke liye API_BASE_URL jodo (backward compatibility)
  const getProfilePicUri = (pic) => {
    if (!pic) return '';
    return pic.startsWith('http') ? pic : `${API_BASE_URL}${pic}`;
  };

  const [name, setName] = useState(existingUser.name || '');
  const [username, setUsername] = useState(existingUser.username || '');
  const [bio, setBio] = useState(existingUser.bio || '');
  const [website, setWebsite] = useState(existingUser.website || '');
  const [gender, setGender] = useState(existingUser.gender || '');
  const [isPrivate, setIsPrivate] = useState(existingUser.isPrivate || false);

  const [profilePic, setProfilePic] = useState(getProfilePicUri(existingUser.profilePic));

  const [newPicUri, setNewPicUri] = useState(null);
  const [saving, setSaving] = useState(false);

  const defaultPic =
    'https://cdn-icons-png.flaticon.com/128/17982/17982321.png';

  const pickImage = () => {

    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },

      (response) => {

        if (
          !response.didCancel &&
          !response.errorMessage &&
          response.assets
        ) {

          setNewPicUri(response.assets[0].uri);
          setProfilePic(response.assets[0].uri);
        }
      }
    );
  };

  const saveProfile = async () => {

    try {

      setSaving(true);

      const token = await getToken();

      const formData = new FormData();

      formData.append('name', name);
      formData.append('username', username);
      formData.append('bio', bio);
      formData.append('website', website);
      formData.append('gender', gender);
      formData.append('isPrivate', isPrivate.toString());

      if (newPicUri) {

        formData.append('profilePic', {
          uri: newPicUri,
          type: 'image/jpeg',
          name: 'profilePic.jpg',
        });
      }

      const response = await fetch(
        `${API_BASE_URL}/api/users/profile`,
        {
          method: 'PUT',

          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },

          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {

        Alert.alert(
          'Success',
          'Profile updated successfully!'
        );

        // ✅ Updated user ko params ke through wapas bhejo
        // taaki ProfileScreen turant naya data dikhaye, bina manual refresh ke
        navigation.navigate({
          name: 'ProfileScreen',
          params: { updatedUser: data.user },
          merge: true,
        });

      } else {

        Alert.alert(
          'Error',
          data.message || 'Something went wrong'
        );
      }

    } catch (error) {

      console.log('SAVE ERROR:', error);

      Alert.alert(
        'Error',
        'Could not save profile'
      );

    } finally {

      setSaving(false);
    }
  };

  return (

    <View style={styles.mainContainer}>

      <StatusBar
        backgroundColor="#0A0A0A"
        barStyle="light-content"
      />

      <LinearGradient
        colors={['#0A0A0A', '#121212', '#181818']}
        style={styles.gradient}
      >

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >

          {/* HEADER */}
          <View style={styles.header}>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.headerBtn}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              Edit Profile
            </Text>

            <TouchableOpacity
              onPress={saveProfile}
              disabled={saving}
              style={styles.headerBtn}
            >

              {
                saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <LinearGradient
                    colors={['#FF007F', '#FF4DA6']}
                    style={styles.doneBtn}
                  >
                    <Text style={styles.doneText}>
                      Save
                    </Text>
                  </LinearGradient>
                )
              }

            </TouchableOpacity>

          </View>

          {/* PROFILE IMAGE */}
          <View style={styles.profileSection}>

            <LinearGradient
              colors={['#FF007F', '#7F5CFF']}
              style={styles.profileBorder}
            >

              <Image
                source={{
                  uri: profilePic || defaultPic
                }}
                style={styles.profilePic}
              />

            </LinearGradient>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={pickImage}
            >

              <LinearGradient
                colors={['#FF007F', '#FF4DA6']}
                style={styles.changePicBtn}
              >

                <Text style={styles.changePicText}>
                  Change Photo
                </Text>

              </LinearGradient>

            </TouchableOpacity>

          </View>

          {/* FORM */}
          <View style={styles.formContainer}>

            {/* NAME */}
            <View style={styles.inputCard}>

              <Text style={styles.label}>
                Full Name
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#666"
                value={name}
                onChangeText={setName}
              />

            </View>

            {/* USERNAME */}
            <View style={styles.inputCard}>

              <Text style={styles.label}>
                Username
              </Text>

              <TextInput
                style={styles.input}
                placeholder="@username"
                placeholderTextColor="#666"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
              />

            </View>

            {/* BIO */}
            <View style={styles.inputCard}>

              <Text style={styles.label}>
                Bio
              </Text>

              <TextInput
                style={[styles.input, styles.bioInput]}
                placeholder="Tell something about yourself..."
                placeholderTextColor="#666"
                multiline
                value={bio}
                onChangeText={setBio}
              />

            </View>

            {/* WEBSITE */}
            <View style={styles.inputCard}>

              <Text style={styles.label}>
                Website
              </Text>

              <TextInput
                style={styles.input}
                placeholder="https://yourwebsite.com"
                placeholderTextColor="#666"
                autoCapitalize="none"
                value={website}
                onChangeText={setWebsite}
              />

            </View>

            {/* GENDER */}
            <View style={styles.inputCard}>

              <Text style={styles.label}>
                Gender
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Your gender"
                placeholderTextColor="#666"
                value={gender}
                onChangeText={setGender}
              />

            </View>

            {/* PRIVATE */}
            <View style={styles.switchCard}>

              <View>
                <Text style={styles.privateTitle}>
                  Private Account
                </Text>

                <Text style={styles.privateSub}>
                  Only followers can see your content
                </Text>
              </View>

              <Switch
                value={isPrivate}
                onValueChange={setIsPrivate}
                thumbColor={isPrivate ? '#fff' : '#ccc'}
                trackColor={{
                  false: '#333',
                  true: '#FF007F'
                }}
              />

            </View>

          </View>

        </ScrollView>

      </LinearGradient>

    </View>
  );
};

export default EditScreen;

const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  gradient: {
    flex: 1,
  },

  header: {
    marginTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  headerBtn: {
    minWidth: 70,
  },

  cancelText: {
    color: '#999',
    fontSize: 15,
    fontWeight: '500',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  doneBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },

  doneText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },

  profileBorder: {
    width: 118,
    height: 118,
    borderRadius: 59,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  profilePic: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#222',
  },

  changePicBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },

  changePicText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  formContainer: {
    paddingHorizontal: 18,
  },

  inputCard: {
    backgroundColor: '#181818',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#252525',
  },

  label: {
    color: '#FF007F',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.5,
  },

  input: {
    color: '#fff',
    fontSize: 15,
    padding: 0,
  },

  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  switchCard: {
    backgroundColor: '#181818',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#252525',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  privateTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  privateSub: {
    color: '#777',
    fontSize: 12,
    marginTop: 4,
  },

});