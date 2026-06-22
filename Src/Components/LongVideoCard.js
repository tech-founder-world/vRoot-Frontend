import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../config/config';

const LongVideoCard = ({ video }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate('LongDetail', { video })}
    >
      <View style={styles.card}>

        {/* 🎬 VIDEO THUMBNAIL */}
        <View style={styles.thumbnailWrapper}>
          <Video
            source={{ uri: `${API_BASE_URL}${video.videoUrl}` }}
            style={styles.thumbnail}
            resizeMode="cover"
            paused
          />

          {/* ▶ PLAY ICON */}
          <View style={styles.playOverlay}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>

        {/* ℹ VIDEO INFO */}
        <View style={styles.info}>
          <Image
            source={require('../Assests/user.png')}
            style={styles.avatar}
          />

          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {video.title}
            </Text>

            <Text style={styles.meta}>
              {video.views || 0} views • {new Date(video.createdAt).toDateString()}
            </Text>
          </View>
        </View>

      </View>
    </TouchableOpacity>
  );
};

export default LongVideoCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0F0F0F',
    marginBottom: 18,
  },

  /* 🎬 Thumbnail */
  thumbnailWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    marginHorizontal: 12,
    backgroundColor: '#111',
  },

  thumbnail: {
    width: '100%',
    height: 220,
  },

  playOverlay: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    backgroundColor: 'rgba(0,0,0,0.55)',
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },

  playIcon: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 2,
  },

  /* ℹ Info Section */
  info: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#333',
  },

  textContainer: {
    flex: 1,
  },

  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },

  meta: {
    color: '#9CA3AF',
    marginTop: 6,
    fontSize: 12,
  },
});
