import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator, Alert, Dimensions,
  Modal, ScrollView, StatusBar, RefreshControl, Animated
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '../config/config';
import { getToken, logoutUser } from '../services/authStorage';

const { width } = Dimensions.get('window');
const ITEM = (width - 4) / 3;

// ✅ Cloudinary URL already poora https link hota hai.
// Sirf purane local-path format ke liye API_BASE_URL jodo (backward compatibility)
const getMediaUri = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
};

// ── Shimmer animation hook ─────────────────────
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



// ── Skeleton block ─────────────────────────────
const Bone = ({ style, opacity }) => (
  <Animated.View style={[styles.bone, style, { opacity }]} />
);

// ── Profile Skeleton Loader ─────────────────────
const ProfileSkeleton = () => {
  const opacity = useShimmer();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* Header */}
      <View style={styles.header}>
        <Bone style={{ width: 110, height: 20, borderRadius: 6 }} opacity={opacity} />
        <Bone style={{ width: 22, height: 22, borderRadius: 6 }} opacity={opacity} />
      </View>

      {/* Profile section */}
      <View style={styles.profileSection}>
        <View style={styles.topRow}>
          <Bone style={{ width: 86, height: 86, borderRadius: 43, marginRight: 22 }} opacity={opacity} />
          <View style={styles.statsRow}>
            {[1, 2, 3].map(i => (
              <View key={i} style={styles.statBox}>
                <Bone style={{ width: 30, height: 18, borderRadius: 4, marginBottom: 6 }} opacity={opacity} />
                <Bone style={{ width: 46, height: 11, borderRadius: 4 }} opacity={opacity} />
              </View>
            ))}
          </View>
        </View>

        <Bone style={{ width: 140, height: 14, borderRadius: 4, marginTop: 2 }} opacity={opacity} />
        <Bone style={{ width: 90,  height: 12, borderRadius: 4, marginTop: 6 }} opacity={opacity} />
        <Bone style={{ width: '85%', height: 12, borderRadius: 4, marginTop: 8 }} opacity={opacity} />

        <View style={styles.btnRow}>
          <Bone style={{ flex: 1, height: 32, borderRadius: 8 }} opacity={opacity} />
          <Bone style={{ flex: 1, height: 32, borderRadius: 8 }} opacity={opacity} />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {[1, 2, 3].map(i => (
          <View key={i} style={styles.tab}>
            <Bone style={{ width: 36, height: 14, borderRadius: 4 }} opacity={opacity} />
          </View>
        ))}
      </View>

      {/* Grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2, paddingTop: 2 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Bone key={i} style={{ width: ITEM, height: ITEM, borderRadius: 0 }} opacity={opacity} />
        ))}
      </View>
    </View>
  );
};

export default function ProfileScreen({ navigation }) {
  const route = useRoute();

  const [user, setUser]           = useState(null);
  const [posts, setPosts]         = useState([]);
  const [reels, setReels]         = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedReels, setSavedReels] = useState([]);
  const [tab, setTab]             = useState('posts');
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [followerList, setFollowerList]   = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const safeJson = async (res) => {
    const text = await res.text();
    try { return JSON.parse(text); } catch { return null; }
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) { navigation.replace('LoginScreen'); return; }

      // Profile
      const profRes  = await fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (profRes.status === 401) {
        await logoutUser();
        Alert.alert('Session Expired', '', [{ text: 'OK', onPress: () => navigation.replace('LoginScreen') }]);
        return;
      }
      const profData = await safeJson(profRes);
      if (!profData?.success) return;
      const u = profData.user;
      setUser(u);

      // My posts
      try {
        const r = await safeJson(await fetch(`${API_BASE_URL}/api/posts/user/${u._id}`));
        if (r?.success) setPosts(r.posts || []);
      } catch (e) { console.log('posts err:', e.message); }

      // My reels
      try {
        const r = await safeJson(await fetch(`${API_BASE_URL}/api/video/user/${u._id}`));
        if (r?.success) setReels(r.reels || []);
      } catch (e) { console.log('reels err:', e.message); }

      // Saved posts
      try {
        const r = await safeJson(await fetch(`${API_BASE_URL}/api/posts/saved`, {
          headers: { Authorization: `Bearer ${token}` }
        }));
        if (r?.success) setSavedPosts(r.posts || []);
      } catch (e) { console.log('saved posts err:', e.message); }

      // Saved reels ✅
      try {
        const r = await safeJson(await fetch(`${API_BASE_URL}/api/video/saved`, {
          headers: { Authorization: `Bearer ${token}` }
        }));
        if (r?.success) setSavedReels(r.reels || []);
      } catch (e) { console.log('saved reels err:', e.message); }

    } catch (err) {
      console.log('fetchAll error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Focus hote hi: agar EditScreen se naya user data aaya hai toh turant dikhao,
  // phir background mein fresh data bhi le aao
  useFocusEffect(
    useCallback(() => {
      if (route.params?.updatedUser) {
        setUser(route.params.updatedUser);
        // Param consume kar liya — dobara trigger na ho isliye clear kar do
        navigation.setParams({ updatedUser: undefined });
      }
      fetchAll();
    }, [route.params?.updatedUser])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  };

  // ── Fetch saved separately ──
  const fetchSaved = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const [savedPostsRes, savedReelsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/posts/saved`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/video/saved`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const savedPostsData = await safeJson(savedPostsRes);
      const savedReelsData = await safeJson(savedReelsRes);

      if (savedPostsData?.success) setSavedPosts(savedPostsData.posts || []);
      if (savedReelsData?.success) setSavedReels(savedReelsData.reels || []);
    } catch (e) {
      console.log('fetchSaved error:', e.message);
    }
  };

  const openFollowers = async () => {
    const token = await getToken();
    const res   = await fetch(`${API_BASE_URL}/api/users/followers`, { headers: { Authorization: `Bearer ${token}` } });
    const data  = await res.json();
    setFollowerList(data?.followers || []);
    setShowFollowers(true);
  };

  const openFollowing = async () => {
    const token = await getToken();
    const res   = await fetch(`${API_BASE_URL}/api/users/following`, { headers: { Authorization: `Bearer ${token}` } });
    const data  = await res.json();
    setFollowingList(data?.following || []);
    setShowFollowing(true);
  };

  const unfollow = async (targetId) => {
    const token = await getToken();
    await fetch(`${API_BASE_URL}/api/users/unfollow/${targetId}`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}` }
    });
    setFollowingList(prev => prev.filter(u => u._id !== targetId));
    setUser(prev => ({ ...prev, following: prev.following.filter(id => String(id) !== String(targetId)) }));
  };

  // profile skeleton
  if (loading) return <ProfileSkeleton />;

  if (!user)   return (
    <View style={styles.center}>
      <Text style={{ color: '#fff' }}>No user found</Text>
      <TouchableOpacity onPress={() => navigation.replace('LoginScreen')} style={styles.loginBtn}>
        <Text style={{ color: '#fff' }}>Login Again</Text>
      </TouchableOpacity>
    </View>
  );

  // Saved tab shows both posts + reels mixed
  const savedAll = [
    ...(savedPosts.map(p => ({ ...p, _ctype: 'post' }))),
    ...(savedReels.map(r => ({ ...r, _ctype: 'reel' }))),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const activeData = tab === 'posts' ? posts : tab === 'reels' ? reels : savedAll;

  const renderGridItem = ({ item }) => {
    const isReel = item._ctype === 'reel' || !!item.videoUrl;
    // ✅ Cloudinary-safe URI
    const imgUri = getMediaUri(item.imageUrl) || getMediaUri(item.thumbnail) || getMediaUri(item.videoUrl);

    return (
      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => {
          if (isReel) navigation.navigate('Reels', { videos: [item], initialIndex: 0 });
          else navigation.navigate('Home', { post: item });
        }}
      >
        {imgUri ? (
          <Image source={{ uri: imgUri }} style={styles.gridImg} resizeMode="cover" />
        ) : (
          <View style={[styles.gridImg, styles.videoPlaceholder]}>
            <Text style={{ fontSize: 28, color: '#fff' }}>▶</Text>
          </View>
        )}
        {isReel && <View style={styles.badge}><Text style={{ color: '#fff', fontSize: 10 }}>▶</Text></View>}
        {tab === 'saved' && <View style={styles.saveBadge}><Text style={{ color: '#fff', fontSize: 10 }}>🔖</Text></View>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <View style={styles.header}>
        <Text style={styles.headerName}>@{user.username || user.name}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SettingScreen')}>
          {/* <Text style={styles.settingIcon}>☰</Text> */}
                      <Image source={require("../Assests/menu.png") }style={{height:25,width:25,tintColor:"#cec8c8"}}/>
          
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeData}
        keyExtractor={(item, i) => item._id || i.toString()}
        numColumns={3}
        key={tab}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        columnWrapperStyle={{ gap: 2, marginBottom: 2 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF007F" colors={['#FF007F']} />}

        ListHeaderComponent={() => (
          <View>
            <View style={styles.profileSection}>
              <View style={styles.topRow}>
                <Image
                  source={getMediaUri(user.profilePic) ? { uri: getMediaUri(user.profilePic) } : require('../Assests/user.png')}
                  style={styles.profilePic}
                />
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statNum}>{posts.length + reels.length}</Text>
                    <Text style={styles.statLbl}>Posts</Text>
                  </View>
                  <TouchableOpacity style={styles.statBox} onPress={openFollowers}>
                    <Text style={styles.statNum}>{user.followers?.length || 0}</Text>
                    <Text style={styles.statLbl}>Followers</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.statBox} onPress={openFollowing}>
                    <Text style={styles.statNum}>{user.following?.length || 0}</Text>
                    <Text style={styles.statLbl}>Following</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.name}>{user.name}</Text>
              {!!user.username && <Text style={styles.username}>@{user.username}</Text>}
              {!!user.bio     && <Text style={styles.bio}>{user.bio}</Text>}
              {!!user.website && <Text style={styles.website}>🔗 {user.website}</Text>}

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditScreen', { user })}>
                  <Text style={styles.btnText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editBtn} onPress={() => Alert.alert('Share', 'Coming soon!')}>
                  <Text style={styles.btnText}>Share Profile</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.tabs}>
              <TouchableOpacity style={[styles.tab, tab === 'posts' && styles.tabActive]} onPress={() => setTab('posts')}>
                <Text style={[styles.tabTxt, tab === 'posts' && styles.tabTxtActive]}>⊞  {posts.length}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, tab === 'reels' && styles.tabActive]} onPress={() => setTab('reels')}>
                <Text style={[styles.tabTxt, tab === 'reels' && styles.tabTxtActive]}>▶  {reels.length}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, tab === 'saved' && styles.tabActive]} onPress={() => { setTab('saved'); fetchSaved(); }}>
                <Text style={[styles.tabTxt, tab === 'saved' && styles.tabTxtActive]}>🔖  {savedAll.length}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        ListEmptyComponent={
          <View style={[styles.center, { marginTop: 50 }]}>
            <Text style={{ fontSize: 44 }}>{tab === 'posts' ? '🖼️' : tab === 'reels' ? '🎬' : '🔖'}</Text>
            <Text style={{ color: '#555', marginTop: 10 }}>
              {tab === 'saved' ? 'Nothing saved yet' : `No ${tab} uploaded yet`}
            </Text>
            {tab !== 'saved' && (
              <TouchableOpacity style={styles.uploadHint} onPress={() => navigation.navigate('UploadScreen')}>
                <Text style={{ color: '#FF007F', fontWeight: '700' }}>Upload Now</Text>
              </TouchableOpacity>
            )}
          </View>
        }

        renderItem={renderGridItem}
      />

      {/* Followers Modal */}
      <Modal visible={showFollowers} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Followers</Text>
              <TouchableOpacity onPress={() => setShowFollowers(false)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView>
              {followerList.length === 0
                ? <Text style={styles.emptyTxt}>No followers yet</Text>
                : followerList.map(u => (
                  <TouchableOpacity key={u._id} style={styles.userRow}
                    onPress={() => { setShowFollowers(false); navigation.navigate('OtherProfile', { userId: u._id }); }}>
                    <Image source={getMediaUri(u.profilePic) ? { uri: getMediaUri(u.profilePic) } : require('../Assests/user.png')} style={styles.modalAvatar} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalUname}>{u.username || u.name}</Text>
                      <Text style={styles.modalSub}>{u.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              }
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Following Modal */}
      <Modal visible={showFollowing} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Following</Text>
              <TouchableOpacity onPress={() => setShowFollowing(false)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView>
              {followingList.length === 0
                ? <Text style={styles.emptyTxt}>Not following anyone</Text>
                : followingList.map(u => (
                  <View key={u._id} style={styles.userRow}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                      onPress={() => { setShowFollowing(false); navigation.navigate('OtherProfile', { userId: u._id }); }}>
                      <Image source={getMediaUri(u.profilePic) ? { uri: getMediaUri(u.profilePic) } : require('../Assests/user.png')} style={styles.modalAvatar} />
                      <View><Text style={styles.modalUname}>{u.username || u.name}</Text><Text style={styles.modalSub}>{u.name}</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.unfollowBtn}
                      onPress={() => Alert.alert('Unfollow', `Unfollow ${u.username || u.name}?`, [
                        { text: 'Cancel' },
                        { text: 'Unfollow', style: 'destructive', onPress: () => unfollow(u._id) }
                      ])}>
                      <Text style={styles.unfollowTxt}>Following</Text>
                    </TouchableOpacity>
                  </View>
                ))
              }
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', },
  center:    {  justifyContent: 'center', alignItems: 'center' },
  loginBtn:  { marginTop: 16, backgroundColor: '#FF007F', padding: 10, borderRadius: 8 },

  bone: { backgroundColor: '#262626' },

  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 10 },
  headerName: { color: '#fff', fontSize: 20, fontWeight: '800' },
  settingIcon:{ color: '#fff', fontSize: 22 },

  profileSection: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  topRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  profilePic:{ width: 86, height: 86, borderRadius: 43, borderWidth: 2.5, borderColor: '#FF007F', marginRight: 22 },

  statsRow:  { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  statBox:   { alignItems: 'center' },
  statNum:   { color: '#fff', fontSize: 18, fontWeight: '800' },
  statLbl:   { color: '#aaa', fontSize: 12, marginTop: 2 },

  name:    { color: '#fff', fontSize: 15, fontWeight: '700', marginTop: 2 },
  username:{ color: '#aaa', fontSize: 13, marginTop: 1 },
  bio:     { color: '#ddd', fontSize: 13, marginTop: 5, lineHeight: 18 },
  website: { color: '#4DA6FF', fontSize: 13, marginTop: 3 },

  btnRow:  { flexDirection: 'row', gap: 8, marginTop: 12 },
  editBtn: { flex: 1, borderWidth: 1, borderColor: '#3a3a3a', borderRadius: 8, paddingVertical: 7, alignItems: 'center', backgroundColor: '#1e1e1e' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  tabs:        { flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: '#2a2a2a', marginTop: 10 },
  tab:         { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive:   { borderBottomWidth: 2, borderBottomColor: '#FF007F' },
  tabTxt:      { color: '#555', fontSize: 17, fontWeight: '600' },
  tabTxtActive:{ color: '#FF007F' },

  gridItem:  { width: ITEM, height: ITEM, margin: 1, backgroundColor: '#1a1a1a' },
  gridImg:   { width: '100%', height: '100%' },
  badge:     { position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10, padding: 3 },
  saveBadge: { position: 'absolute', bottom: 5, left: 5, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10, padding: 3 },
  uploadHint:{ marginTop: 14, borderWidth: 1, borderColor: '#FF007F', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 20 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalBox:     { backgroundColor: '#1a1a1a', borderTopLeftRadius: 22, borderTopRightRadius: 22, maxHeight: '75%', paddingBottom: 30 },
  modalHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 0.5, borderBottomColor: '#2a2a2a' },
  modalTitle:   { color: '#fff', fontSize: 17, fontWeight: '700' },
  modalClose:   { color: '#888', fontSize: 20 },
  emptyTxt:     { color: '#555', textAlign: 'center', marginTop: 40, paddingBottom: 20 },
  userRow:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#222' },
  modalAvatar:  { width: 46, height: 46, borderRadius: 23, marginRight: 12 },
  modalUname:   { color: '#fff', fontWeight: '700', fontSize: 14 },
  modalSub:     { color: '#aaa', fontSize: 12, marginTop: 2 },
  unfollowBtn:  { borderWidth: 1, borderColor: '#3a3a3a', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 14, backgroundColor: '#222' },
  unfollowTxt:  { color: '#fff', fontSize: 13, fontWeight: '600' },
  videoPlaceholder: {
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#1a1a1a',
},
});