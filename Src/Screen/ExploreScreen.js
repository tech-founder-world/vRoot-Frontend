import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  StatusBar,
  Keyboard,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE_URL } from '../config/config';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 4) / 3;

const CATEGORIES = ['All', 'Trending', 'Music', 'Dance', 'Comedy', 'Fitness', 'Tech', 'Travel', 'Food'];

// Shuffle array randomly
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// ✅ Cloudinary URL already poora https link hota hai
const getMediaUri = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
};

// Get video thumbnail — try to extract from video URL or use a placeholder
const getThumbnail = (item) => {
  if (item.thumbnail) return getMediaUri(item.thumbnail);
  if (item.thumbnailUrl) return getMediaUri(item.thumbnailUrl);
  return null;
};

// ── Mix posts + reels randomly (Instagram-style explore grid) ──
// Har 7th-8th item ek reel hota hai (bigger tile), baaki posts
const mixExploreFeed = (posts, reels) => {
  const shuffledPosts = shuffle(posts);
  const shuffledReels = shuffle(reels);
  const mixed = [];
  let reelIdx = 0;

  shuffledPosts.forEach((post, i) => {
    mixed.push({ ...post, _gridType: 'post' });
    // Har 6 posts ke baad ek reel insert karo
    if ((i + 1) % 6 === 0 && reelIdx < shuffledReels.length) {
      mixed.push({ ...shuffledReels[reelIdx++], _gridType: 'reel' });
    }
  });

  // Bache hue reels end mein add kar do
  while (reelIdx < shuffledReels.length) {
    mixed.push({ ...shuffledReels[reelIdx++], _gridType: 'reel' });
  }

  return shuffle(mixed.length > 30 ? mixed.slice(0, 60) : mixed);
};

// ── Shimmer hook ────────────────────────────────
const useShimmer = () => {
  const shimmer = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1,   duration: 700, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return shimmer;
};

const Bone = ({ style, opacity }) => (
  <Animated.View style={[styles.bone, style, { opacity }]} />
);

// ── Explore Skeleton Loader ──────────────────────
const ExploreSkeleton = () => {
  const opacity = useShimmer();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <Bone style={{ width: 90, height: 22, borderRadius: 6 }} opacity={opacity} />
      </View>
      <View style={{ marginHorizontal: 12, marginTop: 10, marginBottom: 8 }}>
        <Bone style={{ height: 46, borderRadius: 14 }} opacity={opacity} />
      </View>
      <View style={{ flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, gap: 8 }}>
        {[60, 80, 70, 75, 65].map((w, i) => (
          <Bone key={i} style={{ width: w, height: 34, borderRadius: 17 }} opacity={opacity} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2, paddingTop: 4 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Bone
            key={i}
            style={{ width: ITEM_SIZE, height: ITEM_SIZE * 1.4, margin: 1, borderRadius: 4 }}
            opacity={opacity}
          />
        ))}
      </View>
    </View>
  );
};

export default function ExploreScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [users, setUsers] = useState([]);
  const [exploreFeed, setExploreFeed] = useState([]);
const [myId, setMyId] = useState(null);
  const searchTimer = useRef(null);
  const isFirstLoad = useRef(true);

  // ── Load posts + reels together, mix randomly ──
  const loadDefault = useCallback(async (randomize = true) => {
    try {
      if (isFirstLoad.current) setLoading(true);

      const [reelRes, postRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/video/explore?search=&category=${category}`),
        fetch(`${API_BASE_URL}/api/posts/feed`),
      ]);
      const [reelData, postData] = await Promise.all([reelRes.json(), postRes.json()]);

      const videos = reelData.videos || [];
      const allPosts = postData.success ? (postData.posts || []) : [];

      setExploreFeed(mixExploreFeed(allPosts, videos));
    } catch (e) {
      console.log('loadDefault error:', e);
    } finally {
      setLoading(false);
      isFirstLoad.current = false;
    }
  }, [category]);

  // ✅ Pehli load
  useEffect(() => { loadDefault(); }, [category]);

  // ✅ Tab focus hote hi naya random mix — Instagram explore jaisa
  useFocusEffect(
    useCallback(() => {
      if (!isFirstLoad.current && !searchMode) {
        loadDefault(true);
      }
    }, [searchMode])
  );

  const doSearch = async (q) => {
    if (!q.trim()) { setSearchMode(false); return; }
    try {
      setSearchLoading(true);
      setSearchMode(true);
      const [userRes, postRes, reelRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/users/search?q=${q}`),
        fetch(`${API_BASE_URL}/api/posts/search?q=${q}`),
        fetch(`${API_BASE_URL}/api/video/explore?search=${q}&category=All`),
      ]);
      const [userData, postData, reelData] = await Promise.all([
        userRes.json(), postRes.json(), reelRes.json()
      ]);
      setUsers(userData.users || []);
      setPosts(postData.posts || []);
      setReels(reelData.videos || []);
    } catch (e) {
      console.log('search error:', e);
    } finally {
      setSearchLoading(false);
    }
  };

  // ✅ Pull-to-refresh — naya random mix
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (searchMode && query.trim()) {
        await doSearch(query);
      } else {
        await loadDefault(true);
      }
    } catch (e) {
      console.log('refresh error:', e);
    } finally {
      setRefreshing(false);
    }
  };

  const onChangeText = (text) => {
    setQuery(text);
    clearTimeout(searchTimer.current);
    if (!text.trim()) { setSearchMode(false); return; }
    searchTimer.current = setTimeout(() => doSearch(text), 500);
  };

  const openPost = (item) => navigation.navigate('Home', { post: item });

  const openReel = (item, allReels, startIndex) => {
    if (!item || !item.videoUrl) return;
    navigation.navigate('Reels', {
      initialIndex: startIndex ?? 0,
      videos: allReels ?? [item],
    });
  };


  // get user id
   useEffect(() => {
    const getUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setMyId(user._id || user.id);
        }
      } catch (error) {
        console.log('Error getting user data:', error);
      }
    };
    getUserId();
  }, []);

 const openUser = (item) => {
    if (!item?._id || !myId) return;
    
    if (String(item._id) === String(myId)) {
      navigation.navigate('TabNavigation', {
        screen: 'Profile',
      });
    } else {
      navigation.navigate('OtherProfile', { userId: item._id });
    }
  };
  // ── Mixed grid item (post OR reel) ──
  const renderGridItem = ({ item, index }) => {
    const isReel = item._gridType === 'reel';
    const imgUri = isReel ? getThumbnail(item) : getMediaUri(item.imageUrl);

    // Instagram-style: kabhi kabhi bada tile (har 9th item)
    const isBigTile = index % 9 === 4;

    return (
      <TouchableOpacity
        style={[styles.gridItem, isBigTile && styles.gridItemBig]}
        activeOpacity={0.85}
        onPress={() => {
          if (isReel) {
            const allReelsInFeed = exploreFeed.filter(f => f._gridType === 'reel');
            const idx = allReelsInFeed.findIndex(r => r._id === item._id);
            openReel(item, allReelsInFeed, idx >= 0 ? idx : 0);
          } else {
            openPost(item);
          }
        }}
      >
        {imgUri ? (
          <Image source={{ uri: imgUri }} style={styles.gridImg} resizeMode="cover" />
        ) : (
          <View style={styles.gridImgFallback}>
            <Text style={{ fontSize: 28 }}>{isReel ? '▶' : '🖼️'}</Text>
          </View>
        )}

        {isReel && (
          <View style={styles.reelBadge}>
            <Text style={{ color: '#fff', fontSize: 11 }}>▶</Text>
          </View>
        )}

        {!isReel && item.likes?.length > 50 && (
          <View style={styles.multiBadge}>
            <Text style={{ color: '#fff', fontSize: 11 }}>❤️</Text>
          </View>
        )}

        {isReel && item.duration ? (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
              {Math.floor(item.duration / 60)}:{String(Math.floor(item.duration % 60)).padStart(2, '0')}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  // ── Search results ──
  const renderSearchResults = () => {
    const data = [
      ...(users.length ? [{ _type: 'header', label: `👤 Users (${users.length})` }, ...users.map(u => ({ ...u, _type: 'user' }))] : []),
      ...(posts.length ? [{ _type: 'header', label: `🖼️ Posts (${posts.length})` }, ...posts.map(p => ({ ...p, _type: 'post' }))] : []),
      ...(reels.length ? [{ _type: 'header', label: `🎬 Reels (${reels.length})` }, ...reels.map(r => ({ ...r, _type: 'reel' }))] : []),
      ...(users.length === 0 && posts.length === 0 && reels.length === 0 && !searchLoading ? [{ _type: 'empty' }] : []),
    ];

    if (searchLoading) {
      return (
        <View style={[styles.center, { marginTop: 40 }]}>
          <ActivityIndicator size="large" color="#FF007F" />
        </View>
      );
    }

    return (
      <FlatList
        data={data}
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyExtractor={(item, i) => item._id || i.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          if (item._type === 'header') return <Text style={styles.sectionHeader}>{item.label}</Text>;

          if (item._type === 'empty') return (
            <View style={styles.center}>
              <Text style={{ fontSize: 40, marginTop: 40 }}>🔍</Text>
              <Text style={{ color: '#555', marginTop: 10 }}>No results for "{query}"</Text>
            </View>
          );

          if (item._type === 'user') return (
            <TouchableOpacity style={styles.userRow} onPress={() => openUser(item)} activeOpacity={0.8}>
              <Image
                source={getMediaUri(item.profilePic) ? { uri: getMediaUri(item.profilePic) } : require('../Assests/user.png')}
                style={styles.userAvatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{item.username || item.name}</Text>
                <Text style={styles.userSub}>{item.name} · {item.followers?.length || 0} followers</Text>
              </View>
              <View style={styles.followBtn}>
                <Text style={styles.followBtnText}>Follow</Text>
              </View>
            </TouchableOpacity>
          );

          if (item._type === 'post') return (
            <TouchableOpacity style={styles.postRow} onPress={() => openPost(item)} activeOpacity={0.8}>
              <Image source={{ uri: getMediaUri(item.imageUrl) }} style={styles.postThumb} />
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={styles.postCaption} numberOfLines={2}>{item.caption || 'No caption'}</Text>
                {!!item.location && <Text style={styles.postLocation}>📍 {item.location}</Text>}
                <Text style={styles.postMeta}>{item.userId?.username || item.userId?.name} · ❤️ {item.likes?.length || 0}</Text>
              </View>
            </TouchableOpacity>
          );

          if (item._type === 'reel') {
            const thumb = getThumbnail(item);
            return (
              <TouchableOpacity style={styles.postRow} onPress={() => openReel(item, reels, reels.findIndex(r => r._id === item._id))} activeOpacity={0.8}>
                {thumb ? (
                  <Image source={{ uri: thumb }} style={styles.postThumb} />
                ) : (
                  <View style={[styles.postThumb, styles.videoFallback]}>
                    <Text style={{ fontSize: 22 }}>▶</Text>
                  </View>
                )}
                <View style={{ flex: 1, paddingLeft: 10 }}>
                  <Text style={styles.postCaption} numberOfLines={2}>{item.title || 'Reel'}</Text>
                  <Text style={styles.postLocation}>{item.category || ''}</Text>
                  <Text style={styles.postMeta}>❤️ {item.likes?.length || 0} · 👁 {item.views || 0}</Text>
                </View>
                <View style={styles.reelTag}><Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>▶ Reel</Text></View>
              </TouchableOpacity>
            );
          }

          return null;
        }}
      />
    );
  };

  // ✅ First load → skeleton
  if (loading) return <ExploreSkeleton />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        {/* <Text style={styles.searchIcon}>🔍</Text> */}
                    <Image source={require("../Assests/search.png") }style={{height:20,width:20,tintColor:"#9e9797"}}/>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Search users, posts, reels..."
          placeholderTextColor="#444"
          value={query}
          onChangeText={onChangeText}
          returnKeyType="search"
          onSubmitEditing={() => doSearch(query)}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setSearchMode(false); Keyboard.dismiss(); }}>
            <Text style={{ color: '#888', fontSize: 18, marginRight: 2 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category chips */}
      {!searchMode && (
        <FlatList
          data={CATEGORIES}
          horizontal
          keyExtractor={i => i}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, category === item && styles.chipActive]}
              onPress={() => setCategory(item)}
            >
              <Text style={[styles.chipTxt, category === item && styles.chipTxtActive]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Content */}
      {searchMode
        ? renderSearchResults()
        : (
          <FlatList
            data={exploreFeed}
            refreshing={refreshing}
            onRefresh={onRefresh}
            keyExtractor={(item, i) => `${item._id || i}-${item._gridType}`}
            numColumns={3}
            columnWrapperStyle={{ gap: 2, marginBottom: 2 }}
            contentContainerStyle={{ paddingBottom: 100, paddingTop: 4 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={{ fontSize: 40, marginTop: 60 }}>🧭</Text>
                <Text style={{ color: '#444', marginTop: 10, fontSize: 15 }}>No content found</Text>
              </View>
            }
            renderItem={renderGridItem}
          />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  bone: { backgroundColor: '#1a1a1a' },

  header: {
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderRadius: 14,
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 8,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#222',
  },
  searchIcon: { fontSize: 15, marginRight: 8 },
  searchInput: { flex: 1, color: '#fff', fontSize: 15 },

  chips: { paddingHorizontal: 12, paddingVertical: 8 },
  chip: {
    backgroundColor: '#161616',
    paddingHorizontal: 16,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#222',
  },
  chipActive: { backgroundColor: '#FF007F', borderColor: '#FF007F' },
  chipTxt: { color: '#666', fontSize: 13 },
  chipTxtActive: { color: '#fff', fontWeight: '700' },

  // Grid
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 1.4,
    margin: 1,
    backgroundColor: '#111',
    borderRadius: 2,
    overflow: 'hidden',
  },
  gridItemBig: {
    width: ITEM_SIZE * 2 + 2,
    height: ITEM_SIZE * 2 * 1.4 + 2,
  },
  gridImg: { width: '100%', height: '100%' },
  gridImgFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reelBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 8,
    padding: 3,
    paddingHorizontal: 5,
  },
  multiBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 8,
    padding: 3,
    paddingHorizontal: 5,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  durationText: { color: '#fff', fontSize: 10, fontWeight: '600' },

  // Search
  sectionHeader: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#0d0d0d',
    letterSpacing: 0.3,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#111',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#FF007F',
  },
  userName: { color: '#fff', fontWeight: '700', fontSize: 14 },
  userSub: { color: '#555', fontSize: 12, marginTop: 2 },
  followBtn: {
    backgroundColor: '#FF007F',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  followBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  postRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#111',
  },
  postThumb: { width: 72, height: 72, borderRadius: 8, backgroundColor: '#1a1a1a' },
  videoFallback: { justifyContent: 'center', alignItems: 'center' },
  postCaption: { color: '#fff', fontSize: 13, fontWeight: '600' },
  postLocation: { color: '#666', fontSize: 12, marginTop: 3 },
  postMeta: { color: '#444', fontSize: 11, marginTop: 4 },
  reelTag: {
    backgroundColor: '#FF007F',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
    marginLeft: 6,
  },
});