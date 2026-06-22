import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Text,
  RefreshControl,
  Image,
  TouchableOpacity
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const API_KEY = "AIzaSyBjmnbFslgjHF_4jek98t4urX-bXbp_PCM"; // Replace with your own key
const CHANNEL_ID = "UC_x5XG1OV2P6uZZ5FSM9Ttw"; // Google Developers Channel

const YouTubeAPIList = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet,id&order=date&maxResults=50`
      );
      const data = await response.json();
      setVideos(data.items?.filter((item) => item.id.videoId) || []);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch videos.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchVideos();
  }, []);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="red" />}
      <View style={styles.headerContainer}>
        <Image source={require("../Assests/logos.png")} style={styles.logo} />
        <Text style={styles.appName}>vRoot</Text>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={videos}
        keyExtractor={(item) => item.id.videoId}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("VideoDetailScreen", {
                videoId: item.id.videoId,
                title: item.snippet.title,
                channelTitle: item.snippet.channelTitle,
                publishedAt: item.snippet.publishedAt,
              })
            }
          >
            <View style={styles.videoContainer}>
              <YoutubePlayer height={200} videoId={item.id.videoId} />
              <Text style={styles.videoTitle}>{item.snippet.title}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.videoMeta}>{item.snippet.channelTitle}</Text>
                <Text style={styles.videoMeta}>
                  {item.snippet.publishedAt.substring(0, 10)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["red"]} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FF007F',
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  appName: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#FF007F',
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#121212"
  },
  videoContainer: {
    marginBottom: 10,
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 5
  },
  videoTitle: {
    fontSize: 16,
    color: "azure",
    fontWeight: "bold",
    marginVertical: 5
  },
  videoMeta: {
    fontSize: 14,
    color: "lightgray"
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5
  }
});

export default YouTubeAPIList;
