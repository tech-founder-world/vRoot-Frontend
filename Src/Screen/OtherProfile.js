import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator, Alert, Dimensions, StatusBar,
  Animated
} from 'react-native';
import { API_BASE_URL } from '../config/config';
import { getToken } from '../services/authStorage';

const { width } = Dimensions.get('window');
const ITEM = (width - 4) / 3;

// ── Skeleton Components ──────────────────────────────────
const Shimmer = ({ style }) => {
  const shimmer = new Animated.Value(0.4);
  
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View style={[styles.skeleton, style, { opacity: shimmer }]} />
  );
};

const ProfileSkeleton = () => (
  <View style={styles.skeletonContainer}>
    {/* Header Skeleton */}
    <View style={styles.skeletonHeader}>
      <Shimmer style={styles.skeletonBackBtn} />
      <Shimmer style={styles.skeletonHeaderTitle} />
    </View>

    {/* Profile Info Skeleton */}
    <View style={styles.skeletonProfileSection}>
      <View style={styles.skeletonTopRow}>
        <Shimmer style={styles.skeletonProfilePic} />
        <View style={styles.skeletonStatsRow}>
          {[1, 2, 3].map((_, i) => (
            <View key={i} style={styles.skeletonStatBox}>
              <Shimmer style={styles.skeletonStatNum} />
              <Shimmer style={styles.skeletonStatLbl} />
            </View>
          ))}
        </View>
      </View>
      
      <Shimmer style={styles.skeletonName} />
      <Shimmer style={styles.skeletonUsername} />
      <Shimmer style={styles.skeletonBio} />
      
      <Shimmer style={styles.skeletonFollowBtn} />
    </View>

    {/* Tabs Skeleton */}
    <View style={styles.skeletonTabs}>
      {[1, 2].map((_, i) => (
        <View key={i} style={styles.skeletonTab}>
          <Shimmer style={styles.skeletonTabText} />
        </View>
      ))}
    </View>

    {/* Grid Skeleton */}
    <View style={styles.skeletonGrid}>
      {Array.from({ length: 9 }).map((_, i) => (
        <Shimmer key={i} style={styles.skeletonGridItem} />
      ))}
    </View>
  </View>
);

export default function OtherProfile({ route, navigation }) {
  const { userId } = route.params;

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [tab, setTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [myId, setMyId] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);

  // ✅ Helper to get full media URL
  const getMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${API_BASE_URL}${path}`;
  };

  const safeJson = async (res) => {
    const text = await res.text();
    try { return JSON.parse(text); }
    catch { return null; }
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      // ✅ My profile
      if (token) {
        const meRes = await fetch(`${API_BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const meData = await safeJson(meRes);
        if (meData?.success) {
          setMyId(meData.user._id);
          const alreadyFollowing = meData.user.following?.map(String).includes(String(userId));
          setFollowing(alreadyFollowing);
        }
      }

      // ✅ Other user profile
      const userRes = await fetch(`${API_BASE_URL}/api/users/user/${userId}`);
      const userData = await safeJson(userRes);
      if (userData?.success) setUser(userData.user);

      // ✅ Their posts
      const postRes = await fetch(`${API_BASE_URL}/api/posts/user/${userId}`);
      const postData = await safeJson(postRes);
      if (postData?.success) {
        setPosts(postData.posts || []);
      }

      // ✅ Their reels
      const reelRes = await fetch(`${API_BASE_URL}/api/video/user/${userId}`);
      const reelData = await safeJson(reelRes);
      if (reelData?.success) {
        setReels(reelData.reels || []);
      }

    } catch (err) {
      console.log('OtherProfile error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [userId]);

  // ── Follow / Unfollow ──
  const toggleFollow = async () => {
    try {
      setFollowLoading(true);
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/users/follow/${userId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await safeJson(res);
      if (data?.success) {
        setFollowing(data.following);
        setUser(prev => ({
          ...prev,
          followers: data.following
            ? [...(prev.followers || []), myId]
            : (prev.followers || []).filter(id => String(id) !== String(myId))
        }));
      }
    } catch (err) {
      console.log('Follow error:', err);
      Alert.alert('Error', 'Could not follow/unfollow');
    } finally {
      setFollowLoading(false);
    }
  };

  // ✅ NAVIGATION: Handle Post Click
  const handlePostPress = (post) => {
    navigation.navigate('TabNavigation', {
      screen: 'Home',
      params: { 
        post: post,
        refresh: true 
      }
    });
  };

  // ✅ NAVIGATION: Handle Reel Click
  const handleReelPress = (reel) => {
    navigation.navigate('TabNavigation', {
      screen: 'Reels',
      params: { 
        video: reel,
        initialIndex: 0,
        videos: reels 
      }
    });
  };

  // ── Loading State ──
  if (loading) return <ProfileSkeleton />;

  if (!user) return (
    <View style={styles.center}>
      <Text style={{ color: '#fff' }}>User not found</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={{ color: '#fff' }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  const isMyProfile = String(myId) === String(userId);
  const activeData = tab === 'posts' ? posts : reels;

  // ✅ Render grid item
  const renderGridItem = ({ item }) => {
    const isReel = !!item.videoUrl || !!item.video;
    let imgUri = null;

    if (isReel) {
      imgUri = item.thumbnail || item.thumbnailUrl || item.videoUrl || item.video;
    } else {
      imgUri = item.imageUrl || item.image;
    }

    const fullImgUri = getMediaUrl(imgUri);

    return (
      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => {
          if (isReel) {
            handleReelPress(item);
          } else {
            handlePostPress(item);
          }
        }}
      >
        {fullImgUri ? (
          <Image 
            source={{ uri: fullImgUri }} 
            style={styles.gridImg} 
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.gridImg, styles.placeholderImg]}>
            <Text style={{ fontSize: 30, color: '#555' }}>
              {isReel ? '▶' : '🖼️'}
            </Text>
          </View>
        )}
        {isReel && (
          <View style={styles.reelBadge}>
            <Text style={{ color: '#fff', fontSize: 10 }}>▶</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerName}>{user.username || user.name}</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={activeData}
        keyExtractor={(item, i) => item._id || i.toString()}
        numColumns={3}
        key={tab}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        columnWrapperStyle={{ gap: 2, marginBottom: 2 }}

        ListHeaderComponent={() => (
          <View>
            <View style={styles.profileSection}>

              {/* Pic + Stats */}
              <View style={styles.topRow}>
                <Image
                  source={user.profilePic
                    ? { uri: getMediaUrl(user.profilePic) }
                    : require('../Assests/user.png')}
                  style={styles.profilePic}
                />
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statNum}>{posts.length + reels.length}</Text>
                    <Text style={styles.statLbl}>Posts</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statNum}>{user.followers?.length || 0}</Text>
                    <Text style={styles.statLbl}>Followers</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statNum}>{user.following?.length || 0}</Text>
                    <Text style={styles.statLbl}>Following</Text>
                  </View>
                </View>
              </View>

              {/* Info */}
              <Text style={styles.name}>{user.name}</Text>
              {!!user.username && <Text style={styles.username}>@{user.username}</Text>}
              {!!user.bio && <Text style={styles.bio}>{user.bio}</Text>}
              {!!user.website && <Text style={styles.website}>🔗 {user.website}</Text>}

              {/* Follow / Edit Button */}
              {isMyProfile ? (
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => navigation.navigate('EditScreen', { user })}
                >
                  <Text style={styles.editBtnTxt}>Edit Profile</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={[styles.followBtn, following && styles.followingBtn]}
                    onPress={toggleFollow}
                    disabled={followLoading}
                  >
                    {followLoading
                      ? <ActivityIndicator size="small" color="#fff" />
                      : <Text style={styles.followBtnTxt}>
                          {following ? 'Following ✓' : 'Follow'}
                        </Text>
                    }
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.msgBtn}
                    onPress={() => Alert.alert('Message', 'Coming soon!')}
                  >
                    <Text style={styles.msgBtnTxt}>Message</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, tab === 'posts' && styles.tabActive]}
                onPress={() => setTab('posts')}
              >
                <Text style={[styles.tabTxt, tab === 'posts' && styles.tabTxtActive]}>
                  ⊞  {posts.length}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, tab === 'reels' && styles.tabActive]}
                onPress={() => setTab('reels')}
              >
                <Text style={[styles.tabTxt, tab === 'reels' && styles.tabTxtActive]}>
                  ▶  {reels.length}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        ListEmptyComponent={
          <View style={[styles.center, { marginTop: 50 }]}>
            <Text style={{ fontSize: 44 }}>{tab === 'posts' ? '🖼️' : '🎬'}</Text>
            <Text style={{ color: '#555', marginTop: 10 }}>No {tab} yet</Text>
          </View>
        }

        renderItem={renderGridItem}
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 10,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { color: '#fff', fontSize: 24 },
  headerName: { color: '#fff', fontSize: 18, fontWeight: '800' },

  profileSection: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePic: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2.5,
    borderColor: '#FF007F',
    marginRight: 22,
  },
  statsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: { alignItems: 'center' },
  statNum: { color: '#fff', fontSize: 18, fontWeight: '800' },
  statLbl: { color: '#aaa', fontSize: 12, marginTop: 2 },

  name: { color: '#fff', fontSize: 15, fontWeight: '700', marginTop: 2 },
  username: { color: '#aaa', fontSize: 13, marginTop: 1 },
  bio: { color: '#ddd', fontSize: 13, marginTop: 5, lineHeight: 18 },
  website: { color: '#4DA6FF', fontSize: 13, marginTop: 3 },

  btnRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  followBtn: {
    flex: 1,
    backgroundColor: '#FF007F',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  followingBtn: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  followBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  msgBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  msgBtnTxt: { color: '#fff', fontWeight: '600', fontSize: 14 },
  editBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  editBtnTxt: { color: '#fff', fontWeight: '600', fontSize: 14 },

  tabs: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#2a2a2a',
    marginTop: 10,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#FF007F' },
  tabTxt: { color: '#555', fontSize: 14, fontWeight: '600' },
  tabTxtActive: { color: '#FF007F' },

  gridItem: {
    width: ITEM,
    height: ITEM,
    margin: 1,
    backgroundColor: '#1a1a1a',
  },
  gridImg: {
    width: '100%',
    height: '100%',
  },
  placeholderImg: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  reelBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 3,
  },

  // ── Skeleton Styles ────────────────────────────────────
  skeletonContainer: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
  },
  skeleton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: 10,
    gap: 12,
  },
  skeletonBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  skeletonHeaderTitle: {
    width: 150,
    height: 24,
    borderRadius: 4,
  },
  skeletonProfileSection: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  skeletonTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  skeletonProfilePic: {
    width: 86,
    height: 86,
    borderRadius: 43,
    marginRight: 22,
  },
  skeletonStatsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  skeletonStatBox: {
    alignItems: 'center',
  },
  skeletonStatNum: {
    width: 40,
    height: 20,
    borderRadius: 4,
  },
  skeletonStatLbl: {
    width: 50,
    height: 12,
    borderRadius: 4,
    marginTop: 4,
  },
  skeletonName: {
    width: 150,
    height: 18,
    borderRadius: 4,
    marginTop: 2,
  },
  skeletonUsername: {
    width: 100,
    height: 14,
    borderRadius: 4,
    marginTop: 4,
  },
  skeletonBio: {
    width: 200,
    height: 14,
    borderRadius: 4,
    marginTop: 8,
  },
  skeletonFollowBtn: {
    width: '100%',
    height: 40,
    borderRadius: 8,
    marginTop: 12,
  },
  skeletonTabs: {
    flexDirection: 'row',
    marginTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#2a2a2a',
    paddingTop: 12,
  },
  skeletonTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  skeletonTabText: {
    width: 60,
    height: 16,
    borderRadius: 4,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    marginTop: 4,
  },
  skeletonGridItem: {
    width: ITEM,
    height: ITEM,
    margin: 1,
    borderRadius: 2,
  },
});