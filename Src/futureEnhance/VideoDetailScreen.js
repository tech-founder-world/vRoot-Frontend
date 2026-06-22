import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const VideoDetailScreen = ({ route }) => {
  const { videoId, title, channelTitle, publishedAt } = route.params;

  return (
    <View style={styles.container}>
      <YoutubePlayer height={250} videoId={videoId}  />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>Channel: {channelTitle}</Text>
      <Text style={styles.meta}>Published: {publishedAt.substring(0, 10)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 10 },
  title: { fontSize: 18, color: 'white', marginTop: 10 },
  meta: { fontSize: 14, color: 'gray', marginTop: 5 },
});

export default VideoDetailScreen;
