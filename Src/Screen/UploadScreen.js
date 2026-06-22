import React, { useState } from 'react';
import {
  View, Text, TextInput, Image, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView,
  KeyboardAvoidingView, Platform, Dimensions
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { API_BASE_URL } from '../config/config';
import { getToken } from '../services/authStorage';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export default function UploadScreen({ navigation }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const MAX_CAPTION_LENGTH = 2200;

  const pickFromGallery = () => {
    launchImageLibrary({
      mediaType: 'photo',
      quality: 0.9,
      includeBase64: false,
      selectionLimit: 1
    }, (res) => {
      if (!res.didCancel && res.assets) {
        const asset = res.assets[0];
        setFile({ uri: asset.uri, type: asset.type, name: asset.fileName || 'photo.jpg' });
        setPreview(asset.uri);
      }
    });
  };

  const pickFromCamera = () => {
    launchCamera({
      mediaType: 'photo',
      quality: 0.9,
      saveToPhotos: true
    }, (res) => {
      if (!res.didCancel && res.assets) {
        const asset = res.assets[0];
        setFile({ uri: asset.uri, type: asset.type, name: asset.fileName || 'photo.jpg' });
        setPreview(asset.uri);
      }
    });
  };

  const handleCaptionChange = (text) => {
    if (text.length <= MAX_CAPTION_LENGTH) {
      setCaption(text);
      setCharacterCount(text.length);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      Alert.alert('No Photo Selected', 'Please select a photo to share', [
        { text: 'OK', style: 'default' }
      ]);
      return;
    }

    try {
      setUploading(true);
      const token = await getToken();

      const formData = new FormData();
      formData.append('image', { uri: file.uri, type: file.type, name: file.name });
      formData.append('caption', caption);
      formData.append('location', location);
      formData.append('isPublic', isPublic.toString());

      const res = await fetch(`${API_BASE_URL}/api/posts/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await res.json();

      // if (data.success) {
      //   Alert.alert(
      //     'Success! 🎉',
      //     'Your post has been shared with the world',
      //     [
      //       {
      //         text: 'View Post',
      //         onPress: () => navigation.replace('TabNavigation')
      //       },
      //       {
      //         text: 'Share Another',
      //         style: 'cancel'
      //       }
      //     ]
      //   );
      // } 
      if(data.success){
        navigation.replace("TabNavigation")
      }
      else {
        Alert.alert('Upload Failed', data.message || 'Something went wrong');
      }
    } catch (err) {
      console.log('Upload error:', err);
      Alert.alert('Error', 'Could not upload post. Check your connection.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#1a1a1a', '#0a0a0a']}
          style={styles.header}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerLeft}
          >
            {/* <Icon name="close-outline" size={28} color="#FF007F" /> */}
            
                <Image source={require("../Assests/cross.png")} style={{ height: 15, width: 15, tintColor: '#cfc7cb' }} />

            <Text style={styles.cancelText}>Discard</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Create Post</Text>

          <TouchableOpacity
            onPress={handleUpload}
            disabled={uploading || !file}
            style={[
              styles.shareButton,
              (!file || uploading) && styles.shareButtonDisabled
            ]}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                {/* <Icon name="send-outline" size={18} color="#fff" /> */}
                <Image source={require("../Assests/send.png")} style={{ height: 18, width: 18, tintColor: '#b6afaf' }} />

                <Text style={styles.shareText}>Share</Text>
              </>
            )}
          </TouchableOpacity>
        </LinearGradient>

        {/* Media Preview Section */}
        {preview ? (
          <View style={styles.previewContainer}>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: preview }} style={styles.previewImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.imageOverlay}
              />
              <TouchableOpacity
                style={styles.changePhotoBtn}
                onPress={() => { setFile(null); setPreview(null); }}
              >
                {/* <Icon name="refresh-outline" size={20} color="#fff" /> */}
                <Text style={styles.changePhotoText}>Change</Text>
                {/* <Image source={require("../Assests/refresh.png")} style={{ height: 25, width: 25, tintColor: '#e20000' }} /> */}

              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Modern Pick Buttons */
          <View style={styles.pickerSection}>
            <Text style={styles.pickerTitle}>Choose Media</Text>
            <Text style={styles.pickerSubtitle}>Select a photo to share</Text>

            <View style={styles.pickerRow}>
              <TouchableOpacity
                style={[styles.pickerBtn, styles.cameraBtn]}
                onPress={pickFromCamera}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FF007F', '#FF4D4D']}
                  style={styles.pickerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {/* <Icon name="camera-outline" size={40} color="#fff" /> */}
                  <Image source={require("../Assests/camera.png")} style={{ height: 25, width: 25, tintColor: '#000000' }} />

                  <Text style={styles.pickerText}>Camera</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.pickerBtn, styles.galleryBtn]}
                onPress={pickFromGallery}
                activeOpacity={0.8}
              >

                <LinearGradient
                  colors={['#4A90E2', '#357ABD']}
                  style={styles.pickerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {/* <Icon name="images-outline" size={40} color="#fff" /> */}
                  <Image source={require("../Assests/gallery.png")} style={{ height: 30, width: 30, tintColor: '#000000' }} />

                  <Text style={styles.pickerText}>Gallery</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
 

        {/* Form Section */}
        <View style={styles.form}>
          {/* Caption Input */}
          <View style={[
            styles.captionContainer,
            isFocused && styles.captionContainerFocused
          ]}>
            <View style={styles.captionHeader}>
              {/* <Icon name="create-outline" size={20} color="#FF007F" /> */}
                <Image source={require("../Assests/edit.png")} style={{ height: 15, width: 15, tintColor: '#969696' }} />

              <Text style={styles.sectionLabel}>Caption</Text>
              <Text style={[
                styles.charCounter,
                characterCount > MAX_CAPTION_LENGTH * 0.9 && styles.charCounterWarning
              ]}>
                {characterCount}/{MAX_CAPTION_LENGTH}
              </Text>
            </View>
            <TextInput
              style={[styles.input, styles.captionInput]}
              value={caption}
              onChangeText={handleCaptionChange}
              placeholder="Write something inspiring..."
              placeholderTextColor="#666"
              multiline
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={MAX_CAPTION_LENGTH}
            />
          </View>

          {/* Location Input */}
          <View style={styles.locationContainer}>
            <View style={styles.locationHeader}>
              {/* <Icon name="location-outline" size={20} color="#FF007F" /> */}
                <Image source={require("../Assests/location.png")} style={{ height: 15, width: 15, tintColor: '#969696' }} />

              <Text style={styles.sectionLabel}>Location</Text>
            </View>
            <TextInput
              style={[styles.input, styles.locationInput]}
              value={location}
              onChangeText={setLocation}
              placeholder="Add a location..."
              placeholderTextColor="#666"
            />
          </View>

          {/* Visibility Toggle */}
          <View style={styles.visibilitySection}>
            <View style={styles.visibilityHeader}>
              <Icon name="eye-outline" size={20} color="#FF007F" />
              <Text style={styles.sectionLabel}>Privacy</Text>
            </View>

            <View style={styles.visibilityOptions}>
              <TouchableOpacity
                style={[
                  styles.visibilityOption,
                  isPublic && styles.visibilityOptionActive
                ]}
                onPress={() => setIsPublic(true)}
              >
                <Icon
                  name="globe-outline"
                  size={24}
                  color={isPublic ? '#FF007F' : '#888'}
                />
                <Text style={[
                  styles.visibilityOptionText,
                  isPublic && styles.visibilityOptionTextActive
                ]}>
                  Public
                </Text>
                <Text style={styles.visibilityOptionDesc}>
                  Anyone can see
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.visibilityOption,
                  !isPublic && styles.visibilityOptionActive
                ]}
                onPress={() => setIsPublic(false)}
              >
                <Icon
                  name="lock-closed-outline"
                  size={24}
                  color={!isPublic ? '#FF007F' : '#888'}
                />
                <Text style={[
                  styles.visibilityOptionText,
                  !isPublic && styles.visibilityOptionTextActive
                ]}>
                  Private
                </Text>
                <Text style={styles.visibilityOptionDesc}>
                  Only followers
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tips Section */}
          <View style={styles.tipsContainer}>
            <Icon name="bulb-outline" size={16} color="#FF007F" />
            <Text style={styles.tipsText}>
              Pro tip: Add hashtags and locations to reach more people!
            </Text>
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cancelText: {
    color: '#cfc7cb',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF007F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    gap: 6,
  },
  shareButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  shareText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  pickerSection: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  pickerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  pickerSubtitle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 40,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  pickerBtn: {
    width: width * 0.38,
    height: width * 0.38,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  pickerGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  pickerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  previewContainer: {
    padding: 20,
  },
  imageWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  previewImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#111',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  changePhotoBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 75, 75, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25,
    gap: 6,
    backdropFilter: 'blur(10px)',
    borderWidth:0.5,
    borderColor:"rgba(99, 9, 9, 0.7)"
  },
  changePhotoText: {
    color: '#bbb6b6',
    fontWeight: '600',
    fontSize: 14,
  },

  form: {
    padding: 20,
    gap: 24,
  },
  captionContainer: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222',
    transition: 'all 0.3s',
  },
  captionContainerFocused: {
    borderColor: '#FF007F',
    shadowColor: '#FF007F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  captionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  charCounter: {
    color: '#888',
    fontSize: 12,
  },
  charCounterWarning: {
    color: '#FF9800',
  },
  input: {
    color: '#fff',
    fontSize: 15,
    padding: 0,
  },
  captionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  locationContainer: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  locationInput: {
    height: 44,
  },

  visibilitySection: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  visibilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  visibilityOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  visibilityOption: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  visibilityOptionActive: {
    borderColor: '#FF007F',
    backgroundColor: '#1a0a12',
  },
  visibilityOptionText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  visibilityOptionTextActive: {
    color: '#FF007F',
  },
  visibilityOptionDesc: {
    color: '#555',
    fontSize: 11,
    textAlign: 'center',
  },

  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0a12',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  tipsText: {
    color: '#FF007F',
    fontSize: 12,
    flex: 1,
  },
});