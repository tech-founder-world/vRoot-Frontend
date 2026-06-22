import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import Video from 'react-native-video';
import { API_BASE_URL } from '../config/config';

const LongVideoDetailsScreen = ({ route }) => {
  const { video } = route.params;
  const [paused, setPaused] = useState(false);

  return (
    <View style={styles.container}>

      {/* 🎬 VIDEO PLAYER */}
      <View style={styles.playerWrapper}>
        <Video
          source={{ uri: `${API_BASE_URL}${video.videoUrl}` }}
          style={styles.video}
          controls
          resizeMode="contain"
          paused={paused}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 📌 TITLE */}
        <Text style={styles.title}>{video.title}</Text>

        {/* 👀 META */}
        <Text style={styles.meta}>
          {video.views || 0} views • {new Date(video.createdAt).toDateString()}
        </Text>

        {/* 👍 ACTIONS */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.icon}>👍</Text>
            <Text style={styles.actionText}>Like</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.icon}>🔗</Text>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.icon}>⬇️</Text>
            <Text style={styles.actionText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* 📝 DESCRIPTION */}
        <View style={styles.descCard}>
          <Text style={styles.descTitle}>Description</Text>
          <Text style={styles.descText}>
            {video.description || 'No description provided.'}
          </Text>
        </View>

        {/* 🔽 EXTRA SPACE */}
        <View style={{ height: 30 }} />

      </ScrollView>
    </View>
  );
};

export default LongVideoDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },

  /* 🎬 Player */
  playerWrapper: {
    backgroundColor: '#000',
    elevation: 6,
  },

  video: {
    width: '100%',
    height: 240,
    backgroundColor: '#000',
  },

  /* 📌 Title */
  title: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '600',
    marginHorizontal: 14,
    marginTop: 14,
    lineHeight: 26,
  },

  /* 👀 Meta */
  meta: {
    color: '#9CA3AF',
    fontSize: 13,
    marginHorizontal: 14,
    marginTop: 6,
  },

  /* 👍 Actions */
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    marginTop: 10,
  },

  actionBtn: {
    alignItems: 'center',
  },

  icon: {
    fontSize: 20,
    marginBottom: 4,
  },

  actionText: {
    color: '#E5E7EB',
    fontSize: 13,
  },

  /* 📝 Description */
  descCard: {
    backgroundColor: '#111',
    margin: 14,
    padding: 14,
    borderRadius: 12,
  },

  descTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },

  descText: {
    color: '#D1D5DB',
    lineHeight: 22,
    fontSize: 14,
  },
});
