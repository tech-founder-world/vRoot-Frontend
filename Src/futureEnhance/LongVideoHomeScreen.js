import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  RefreshControl,
  Text,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import LongVideoCard from '../Components/LongVideoCard';
import { API_BASE_URL } from '../config/config';

export default function LongVideoHomeScreen() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 5;

  const fetchVideos = async (pageNumber = 1, refresh = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/video/long?page=${pageNumber}&limit=${LIMIT}`
      );
      const data = await res.text();

      if (data.videos?.length > 0) {
        setVideos(prev =>
          refresh ? data.videos : [...prev, ...data.videos]
        );
        setPage(pageNumber);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVideos(1, true);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setHasMore(true);
    fetchVideos(1, true);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchVideos(page + 1);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0F0F0F" barStyle="light-content" />

      {/* 🔝 HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../Assests/logos.png')}
            style={styles.logo}
          />
          <Text style={styles.appName}>vRoot</Text>
        </View>
      </View>

      {/* 🎥 VIDEO LIST */}
      <FlatList
        data={videos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <LongVideoCard video={item} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.6}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF2E63"
          />
        }
        ListFooterComponent={
          loading && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#FF2E63" />
            </View>
          )
        }
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },

  header: {
    height: 58,
    backgroundColor: '#0F0F0F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },

  appName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.5,
  },

  loader: {
    paddingVertical: 25,
  },
});
