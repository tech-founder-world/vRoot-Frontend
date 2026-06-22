import React from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export default function ChoiceModal({ visible, onClose, onMediaSelected, type }) {
  
  const handleCamera = () => {
    const options = {
      mediaType: type === 'reel' ? 'video' : 'photo',
      quality: 0.9,
      saveToPhotos: true,
      durationLimit: type === 'reel' ? 60 : undefined,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        Alert.alert('Error', 'Camera error: ' + response.error.message);
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        onMediaSelected({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName || (type === 'reel' ? 'video.mp4' : 'photo.jpg'),
          duration: asset.duration
        });
        onClose();
      }
    });
  };

  const handleGallery = () => {
    const options = {
      mediaType: type === 'reel' ? 'video' : 'photo',
      quality: 0.9,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled gallery');
      } else if (response.error) {
        Alert.alert('Error', 'Gallery error: ' + response.error.message);
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        onMediaSelected({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName || (type === 'reel' ? 'video.mp4' : 'photo.jpg'),
          duration: asset.duration
        });
        onClose();
      }
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {type === 'reel' ? 'Upload Reel' : 'Upload Post'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.option} onPress={handleCamera}>
            <View style={[styles.iconBg, { backgroundColor: '#FF007F20' }]}>
              <Icon name="camera" size={32} color="#FF007F" />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Camera</Text>
              <Text style={styles.optionDesc}>
                {type === 'reel' ? 'Record a video' : 'Take a photo'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={handleGallery}>
            <View style={[styles.iconBg, { backgroundColor: '#4A90E220' }]}>
              <Icon name="images" size={32} color="#4A90E2" />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Gallery</Text>
              <Text style={styles.optionDesc}>
                {type === 'reel' ? 'Choose from videos' : 'Choose from photos'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    padding: 20,
    width: '85%',
    maxWidth: 350,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
  },
  iconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDesc: {
    color: '#888',
    fontSize: 12,
  },
});