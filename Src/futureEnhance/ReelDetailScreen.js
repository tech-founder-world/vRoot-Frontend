import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StatusBar,
} from 'react-native';

import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const VideoDetailScreen = ({ route, navigation }) => {

  const { video } = route.params;

  const videoRef = useRef(null);

  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  // SAFE VIDEO URL
  const videoUrl =
    video?.videoUrl?.startsWith('http')
      ? video.videoUrl
      : video?.videoUrl;

  if (!video || !videoUrl) {

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Video not found
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <StatusBar hidden />

      {/* VIDEO */}
      <TouchableOpacity
        activeOpacity={1}
        style={styles.videoContainer}
        onPress={() => setPaused(!paused)}
      >

        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode="cover"
          repeat
          paused={paused}

          onLoad={() => {
            setLoading(false);
          }}

          onBuffer={() => {
            setLoading(true);
          }}

          onError={(e) => {
            console.log('VIDEO ERROR:', e);
          }}
        />

        {/* LOADER */}
        {
          loading && (
            <View style={styles.loader}>
              <ActivityIndicator
                size="large"
                color="#fff"
              />
            </View>
          )
        }

        {/* PLAY ICON */}
        {
          paused && (
            <View style={styles.pauseOverlay}>
              <Icon
                name="play"
                size={60}
                color="#fff"
              />
            </View>
          )
        }

      </TouchableOpacity>

      {/* RIGHT ACTIONS */}
      <View style={styles.rightActions}>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setLiked(!liked)}
        >
          <Icon
            name={liked ? 'heart' : 'heart-outline'}
            size={32}
            color={liked ? '#FF007F' : '#fff'}
          />

          <Text style={styles.iconText}>
            {video?.likes?.length || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn}>
          <Icon
            name="chatbubble-outline"
            size={30}
            color="#fff"
          />

          <Text style={styles.iconText}>
            {video?.comments?.length || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn}>
          <Icon
            name="paper-plane-outline"
            size={30}
            color="#fff"
          />

          <Text style={styles.iconText}>
            Share
          </Text>
        </TouchableOpacity>

      </View>

      {/* BOTTOM INFO */}
      <View style={styles.bottomContainer}>

        <View style={styles.userRow}>

          <Image
            source={
              video?.userId?.profilePic
                ? { uri: video.userId.profilePic }
                : require('../Assests/user.png')
            }
            style={styles.profilePic}
          />

          <View>

            <Text style={styles.username}>
              {video?.userId?.username ||
                video?.userId?.name ||
                'vRoot User'}
            </Text>

            <Text style={styles.caption}>
              {video?.title || 'Untitled Reel'}
            </Text>

          </View>

        </View>

      </View>

    </View>
  );
};

export default VideoDetailScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  videoContainer: {
    width,
    height,
  },

  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },

  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pauseOverlay: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
  },

  rightActions: {
    position: 'absolute',
    right: 12,
    bottom: 140,
    alignItems: 'center',
  },

  iconBtn: {
    marginBottom: 24,
    alignItems: 'center',
  },

  iconText: {
    color: '#fff',
    marginTop: 4,
    fontSize: 12,
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    left: 12,
    right: 80,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profilePic: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#FF007F',
  },

  username: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  caption: {
    color: '#ddd',
    marginTop: 4,
    fontSize: 13,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },

  errorText: {
    color: '#fff',
    fontSize: 16,
  },

});