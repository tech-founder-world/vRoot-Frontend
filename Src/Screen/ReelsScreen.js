import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Image, Dimensions, ActivityIndicator, Animated,
  TextInput, KeyboardAvoidingView, Modal, Platform, StatusBar
} from 'react-native';
import Video from 'react-native-video';
import Share from 'react-native-share';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '../config/config';
import { getToken } from '../services/authStorage';

const { height, width } = Dimensions.get('window');
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const ReelsScreen = ({ navigation, route }) => {
  const initialIndex  = route?.params?.initialIndex ?? 0;
  const initialVideos = route?.params?.videos ?? null;

  const [videos, setVideos]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying]       = useState(true);
  const [expandedId, setExpandedId]     = useState(null);
  const [myId, setMyId]                 = useState(null);

  const [likes,    setLikes]    = useState({});
  const [saved,    setSaved]    = useState({});
  const [followed, setFollowed] = useState({});
  const likeScale = useRef(new Animated.Value(1)).current;

  // ✅ Follow state ko ref mein bhi rakho
  // taaki fetchVideos dobara call hone par local changes lost na hon
  const followedRef = useRef({});

  const [commentModal, setCommentModal] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [commentText, setCommentText]   = useState('');
  const [commentsMap, setCommentsMap]   = useState({});

  const flatListRef = useRef(null);

  // ── Fetch reels ──────────────────────────────
  const fetchVideos = async (randomize = false) => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE_URL}/api/video/reels`);
      const data = await res.json();
      let arr = Array.isArray(data) ? data : (data.videos || []);
      if (randomize) arr = shuffle(arr);

      setVideos(arr);

      const map = {};
      arr.forEach(v => { map[v._id] = v.comments || []; });
      setCommentsMap(map);

      const token = await getToken();
      if (token) {
        const meRes  = await fetch(`${API_BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const meData = await meRes.json();
        if (meData.success) {
          const userId = meData.user._id;
          setMyId(userId);

          // ✅ Following list backend se lo
          const myFollowingIds = (meData.user.following || []).map(String);

          // ✅ Followed state: backend data + local changes jo user ne is session mein kiye
          // followedRef mein jo hai wo local overrides hain — unhe preserve karo
          const followMap = {};
          arr.forEach(v => {
            const ownerId = String(v.userId?._id || v.userId);
            if (ownerId in followedRef.current) {
              // User ne is session mein manually follow/unfollow kiya — usse rakho
              followMap[ownerId] = followedRef.current[ownerId];
            } else {
              // Backend se actual state lo
              followMap[ownerId] = myFollowingIds.includes(ownerId);
            }
          });
          setFollowed(followMap);
          followedRef.current = followMap;

          // Saved state
          const savedMap = {};
          arr.forEach(v => {
            savedMap[v._id] = v.savedBy?.map(String).includes(String(userId));
          });
          setSaved(savedMap);

          // Like state
          const likeMap = {};
          arr.forEach(v => {
            likeMap[v._id] = v.likes?.map(String).includes(String(userId));
          });
          setLikes(likeMap);
        }
      }
    } catch (e) {
      console.error('Reels fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialVideos) {
      setVideos(initialVideos);
      const map = {};
      initialVideos.forEach(v => { map[v._id] = v.comments || []; });
      setCommentsMap(map);
      setLoading(false);
    } else {
      fetchVideos();
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsPlaying(true);
      if (!initialVideos) fetchVideos(true);
      return () => setIsPlaying(false);
    }, [])
  );

  useEffect(() => {
    if (videos.length > 0 && initialIndex > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: initialIndex, animated: false });
      }, 200);
    }
  }, [videos]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // ✅ Refresh par followedRef clear karo taaki fresh backend data aaye
    followedRef.current = {};
    await fetchVideos(true);
    setCurrentIndex(0);
    setRefreshing(false);
  }, []);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
      setExpandedId(null);
    }
  }, []);

  // ── Like ─────────────────────────────────────
  const handleLike = async (videoId) => {
    setLikes(prev => {
      const updated = { ...prev, [videoId]: !prev[videoId] };
      if (updated[videoId]) {
        Animated.sequence([
          Animated.timing(likeScale, { toValue: 1.5, duration: 150, useNativeDriver: true }),
          Animated.timing(likeScale, { toValue: 1,   duration: 150, useNativeDriver: true }),
        ]).start();
      }
      return updated;
    });
    try {
      const token = await getToken();
      await fetch(`${API_BASE_URL}/api/video/${videoId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) { console.log(e); }
  };

  // ── Save ─────────────────────────────────────
  const handleSave = async (videoId) => {
    // Optimistic UI
    setSaved(prev => ({ ...prev, [videoId]: !prev[videoId] }));
    try {
      const token = await getToken();
      await fetch(`${API_BASE_URL}/api/video/${videoId}/save`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      // Revert on error
      setSaved(prev => ({ ...prev, [videoId]: !prev[videoId] }));
      console.log(e);
    }
  };

  // ── Follow ────────────────────────────────────
  // ✅ Follow state ref mein bhi save karo
  // taaki fetchVideos dobara aane par local change preserve ho
  const handleFollow = async (targetUserId) => {
    if (!targetUserId) return;

    const newState = !followed[targetUserId];

    // ✅ State + ref dono update karo
    setFollowed(prev => ({ ...prev, [targetUserId]: newState }));
    followedRef.current = { ...followedRef.current, [targetUserId]: newState };

    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/users/follow/${targetUserId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      // ✅ Backend se actual state confirm karo
      // Backend usually toggle karta hai aur response mein actual state deta hai
      if (data?.isFollowing !== undefined) {
        setFollowed(prev => ({ ...prev, [targetUserId]: data.isFollowing }));
        followedRef.current = { ...followedRef.current, [targetUserId]: data.isFollowing };
      }
    } catch (e) {
      // Error pe revert karo
      setFollowed(prev => ({ ...prev, [targetUserId]: !newState }));
      followedRef.current = { ...followedRef.current, [targetUserId]: !newState };
      console.log(e);
    }
  };

  // ── Share ─────────────────────────────────────
  const handleShare = async (videoUrl) => {
    try {
      const url = videoUrl?.startsWith('http') ? videoUrl : `${API_BASE_URL}${videoUrl}`;
      await Share.open({ url: encodeURI(url), message: 'Check out this reel on vRoot!' });
    } catch (e) { console.error(e); }
  };

  // ── Comment ───────────────────────────────────
  const openComments = (videoId) => {
    setActiveVideoId(videoId);
    setCommentModal(true);
  };

  const submitComment = async () => {
    if (!commentText.trim() || !activeVideoId) return;
    const text = commentText.trim();
    setCommentText('');

    const newComment = {
      _id: Date.now().toString(),
      text,
      userId: { username: 'You', name: 'You' },
      createdAt: new Date().toISOString(),
    };
    setCommentsMap(prev => ({
      ...prev,
      [activeVideoId]: [newComment, ...(prev[activeVideoId] || [])],
    }));

    try {
      const token = await getToken();
      const res   = await fetch(`${API_BASE_URL}/api/video/${activeVideoId}/comment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (data.success) {
        setCommentsMap(prev => ({ ...prev, [activeVideoId]: data.comments }));
      }
    } catch (e) { console.log(e); }
  };

  // ── Render item ───────────────────────────────
  const renderItem = ({ item, index }) => {
    const isVisible    = currentIndex === index;
    const isExpanded   = expandedId === item._id;
    const description  = item.description || item.caption || '';
    const videoUrl     = item.videoUrl?.startsWith('http') ? item.videoUrl : `${API_BASE_URL}${item.videoUrl}`;
    const comments     = commentsMap[item._id] || [];
    const username     = item.userId?.username || item.userId?.name || 'vRoot User';
    const profilePic   = item.userId?.profilePic;
    const ownerId      = item.userId?._id || item.userId;
    const isFollowedUser = followed[ownerId];
    const isSaved      = saved[item._id];

    return (
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: videoUrl }}
          style={styles.videoPlayer}
          resizeMode="cover"
          repeat
          controls={false}
          paused={!isVisible || !isPlaying}
          onError={(e) => console.error('Video error:', e)}
        />

        {/* Right actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.profileWrapper}
            onPress={() => ownerId && navigation.navigate('OtherProfile', { userId: ownerId })}
          >
            <Image
              source={profilePic ? { uri: `${API_BASE_URL}${profilePic}` } : require('../Assests/user.png')}
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={[styles.followDot, isFollowedUser && styles.followDotActive]}
              onPress={() => handleFollow(ownerId)}
            >
              <Text style={styles.followPlus}>{isFollowedUser ? '✓' : '+'}</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleLike(item._id)} style={styles.actionButton}>
            <Animated.Text style={[styles.actionEmoji, { transform: [{ scale: likes[item._id] ? likeScale : 1 }] }]}>
              {likes[item._id] ? '❤️' : '🤍'}
            </Animated.Text>
            <Text style={styles.actionCount}>
              {(item.likes?.length || 0) + (likes[item._id] && !item.likes?.map(String).includes(String(myId)) ? 1 : 0)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openComments(item._id)} style={styles.actionButton}>
            <Text style={styles.actionEmoji}>💬</Text>
            <Text style={styles.actionCount}>{comments.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSave(item._id)} style={styles.actionButton}>
            <Text style={styles.actionEmoji}>{isSaved ? '🔖' : '📤'}</Text>
            <Text style={styles.actionCount}>{isSaved ? 'Saved' : 'Save'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleShare(item.videoUrl)} style={styles.actionButton}>
            <Text style={styles.actionEmoji}>↗️</Text>
            <Text style={styles.actionCount}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom info */}
        <View style={styles.bottomInfo}>
          <View style={styles.userRow}>
            <TouchableOpacity onPress={() => ownerId && navigation.navigate('OtherProfile', { userId: ownerId })}>
              <Text style={styles.username}>@{username}</Text>
            </TouchableOpacity>
            {String(ownerId) !== String(myId) && (
              <TouchableOpacity
                style={[styles.followBtn, isFollowedUser && styles.followBtnActive]}
                onPress={() => handleFollow(ownerId)}
              >
                <Text style={styles.followBtnText}>{isFollowedUser ? 'Following' : 'Follow'}</Text>
              </TouchableOpacity>
            )}
          </View>

          {!!item.title && <Text style={styles.videoTitle}>{item.title}</Text>}

          {description.length > 0 && (
            <TouchableOpacity onPress={() => setExpandedId(isExpanded ? null : item._id)}>
              <Text style={styles.videoDescription} numberOfLines={isExpanded ? 0 : 2}>{description}</Text>
              {description.length > 80 && (
                <Text style={styles.moreText}>{isExpanded ? 'less' : '...more'}</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#FF007F" />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <FlatList
        ref={flatListRef}
        data={videos}
        keyExtractor={(item, i) => item._id || i.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={height}
        snapToAlignment="start"
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
        onViewableItemsChanged={onViewableItemsChanged}
        refreshing={refreshing}
        onRefresh={onRefresh}
        getItemLayout={(_, i) => ({ length: height, offset: height * i, index: i })}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.loaderContainer}>
            <Text style={{ color: '#555', fontSize: 15 }}>No reels yet</Text>
          </View>
        }
      />

      <Modal visible={commentModal} animationType="slide" transparent onRequestClose={() => setCommentModal(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setCommentModal(false)} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.commentSheet}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentHeaderTitle}>Comments</Text>
            <TouchableOpacity onPress={() => setCommentModal(false)}>
              <Text style={{ color: '#666', fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={activeVideoId ? (commentsMap[activeVideoId] || []) : []}
            keyExtractor={(item, i) => item._id || i.toString()}
            style={{ flex: 1, paddingHorizontal: 14 }}
            contentContainerStyle={{ paddingBottom: 10 }}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Text style={{ color: '#555' }}>No comments yet. Be first! 🎉</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Image
                  source={item.userId?.profilePic ? { uri: `${API_BASE_URL}${item.userId.profilePic}` } : require('../Assests/user.png')}
                  style={styles.commentAvatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.commentUser}>@{item.userId?.username || item.userId?.name || 'User'}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              </View>
            )}
          />

          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor="#555"
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity style={styles.sendBtn} onPress={submitComment}>
              <Text style={styles.sendBtnText}>Post</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default ReelsScreen;

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#000' },
  videoContainer:  { width, height, backgroundColor: '#000' },
  videoPlayer:     { width, height, position: 'absolute', top: 0, left: 0 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },

  actions: { position: 'absolute', bottom: 130, right: 12, alignItems: 'center' },
  profileWrapper: { alignItems: 'center', marginBottom: 14 },
  profileImage:   { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#fff' },
  followDot:      { position: 'absolute', bottom: -8, backgroundColor: '#FF007F', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  followDotActive:{ backgroundColor: '#444' },
  followPlus:     { color: '#fff', fontSize: 13, fontWeight: 'bold', lineHeight: 20 },
  actionButton:   { alignItems: 'center', marginVertical: 10 },
  actionEmoji:    { fontSize: 28 },
  actionCount:    { color: '#fff', fontSize: 12, marginTop: 2, fontWeight: '600' },

  bottomInfo: { position: 'absolute', bottom: 90, left: 12, width: '75%' },
  userRow:    { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 6, gap: 10 },
  username:   { color: '#fff', fontSize: 15, fontWeight: '800' },
  followBtn:  { borderWidth: 1.5, borderColor: '#fff', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 3 },
  followBtnActive: { borderColor: '#666', backgroundColor: 'rgba(255,255,255,0.1)' },
  followBtnText:   { color: '#fff', fontWeight: '700', fontSize: 12 },
  videoTitle:      { color: '#fff', fontSize: 15, fontWeight: '800', marginBottom: 4 },
  videoDescription:{ color: '#ddd', fontSize: 13, lineHeight: 18 },
  moreText:        { color: '#aaa', fontSize: 12, marginTop: 2 },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  commentSheet:  { height: height * 0.65, backgroundColor: '#111', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 10 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: '#222' },
  commentHeaderTitle: { color: '#fff', fontWeight: '800', fontSize: 16 },
  commentItem:   { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#1a1a1a' },
  commentAvatar: { width: 34, height: 34, borderRadius: 17, marginRight: 10, backgroundColor: '#222' },
  commentUser:   { color: '#FF007F', fontWeight: '700', fontSize: 13 },
  commentText:   { color: '#ddd', fontSize: 14, marginTop: 2, lineHeight: 19 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 0.5, borderTopColor: '#222', backgroundColor: '#111' },
  commentInput:  { flex: 1, backgroundColor: '#1e1e1e', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, color: '#fff', fontSize: 14, maxHeight: 80 },
  sendBtn:       { marginLeft: 10, backgroundColor: '#FF007F', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  sendBtnText:   { color: '#fff', fontWeight: '800', fontSize: 14 },
});