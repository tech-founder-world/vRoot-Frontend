import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
  TextInput, Alert, StatusBar, Dimensions,
  Animated, Share, Modal, ScrollView, KeyboardAvoidingView,
  Platform
} from 'react-native';
import Video from 'react-native-video';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '../config/config';
import { getToken } from '../services/authStorage';

const { width, height } = Dimensions.get('window');
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// ── Mix posts + reels (every 5th item is a reel) ─────────
const mixFeed = (posts, reels) => {
  const shuffledPosts = shuffle(posts);
  const shuffledReels = shuffle(reels);
  const mixed = [];
  let reelIdx = 0;
  shuffledPosts.forEach((post, i) => {
    mixed.push({ ...post, _feedType: 'post' });
    if ((i + 1) % 5 === 0 && reelIdx < shuffledReels.length) {
      mixed.push({ ...shuffledReels[reelIdx++], _feedType: 'reel' });
    }
  });
  return mixed;
};

// ── Double-tap heart animation hook ──────────────────────
const useDoubleTap = (onDoubleTap) => {
  const lastTap = useRef(null);
  return () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      onDoubleTap();
    }
    lastTap.current = now;
  };
};

// ── Floating Heart component ──────────────────────────────
const FloatingHeart = ({ visible }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scale, { toValue: 1.3, useNativeDriver: true, speed: 20 }),
          Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
        ]),
        Animated.delay(400),
        Animated.parallel([
          Animated.timing(scale, { toValue: 1.8, duration: 300, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;
  return (
    <Animated.View style={[styles.floatingHeart, { transform: [{ scale }], opacity }]}>
      <Text style={{ fontSize: 80 }}>❤️</Text>
    </Animated.View>
  );
};

// ── Stories Bar ───────────────────────────────────────────
const StoriesBar = ({ stories }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesBar} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}>
    {stories.map((s, i) => (
      <TouchableOpacity key={i} style={styles.storyItem} onPress={() => Alert.alert('Stories', 'Coming soon!')}>
        <View style={styles.storyRing}>
          <Image source={s.pic ? { uri: s.pic } : require('../Assests/user.png')} style={styles.storyAvatar} />
        </View>
        <Text style={styles.storyName} numberOfLines={1}>{s.name}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

// ── Post Card ─────────────────────────────────────────────
const PostCard = ({ item, myId, onLike, onComment, onSave, onShare, onProfile, onMoreOptions }) => {
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [heartVisible, setHeartVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const liked = item.likes?.map(String).includes(String(myId));
  const saved = item.savedBy?.map(String).includes(String(myId));
  const likeScale = useRef(new Animated.Value(1)).current;
  const caption = item.caption || '';
  const isLongCaption = caption.length > 100;

  const animateLike = () => {
    Animated.sequence([
      Animated.timing(likeScale, { toValue: 1.4, duration: 120, useNativeDriver: true }),
      Animated.spring(likeScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const handleLikePress = () => {
    animateLike();
    onLike(item._id);
  };

  const handleDoubleTap = useDoubleTap(() => {
    if (!liked) {
      setHeartVisible(true);
      onLike(item._id);
      setTimeout(() => setHeartVisible(false), 900);
    }
  });

  const imageUri = item.imageUrl?.startsWith('http')
    ? item.imageUrl
    : `${API_BASE_URL}${item.imageUrl}`;

  const profileUri = item.userId?.profilePic?.startsWith('http')
    ? item.userId.profilePic
    : item.userId?.profilePic ? `${API_BASE_URL}${item.userId.profilePic}` : null;

  const username = item.userId?.username || item.userId?.name || 'User';
  const ownerId = item.userId?._id || item.userId;
  const timeAgo = getTimeAgo(item.createdAt);

  return (
    <View style={styles.card}>
      {/* ── Header ── */}
      <View style={styles.cardHeader}>
        <TouchableOpacity style={styles.cardHeaderLeft} onPress={() => onProfile(ownerId)}>
          <View style={styles.avatarRing}>
            <Image
              source={profileUri ? { uri: profileUri } : require('../Assests/user.png')}
              style={styles.avatar}
            />
          </View>
          <View>
            <Text style={styles.cardUsername}>{username}</Text>
            {!!item.location
              ? <Text style={styles.location}>📍 {item.location}</Text>
              : <Text style={styles.timeAgo}>{timeAgo}</Text>
            }
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onMoreOptions(item)} style={styles.moreBtn}>
          {/* <Text style={styles.moreDots}>•••</Text> */}
            <Image source={require("../Assests/dots.png") }  style={{height:25,width:25,tintColor:"red"}} />

        </TouchableOpacity>
      </View>

      {/* ── Image ── */}
      <TouchableOpacity activeOpacity={1} onPress={handleDoubleTap} style={styles.imageWrapper}>
        <Image source={{ uri: imageUri }} style={styles.postImage} resizeMode="cover" />
        <FloatingHeart visible={heartVisible} />
      </TouchableOpacity>

      {/* ── Action row ── */}
      <View style={styles.actionsRow}>
        <View style={styles.leftActions}>
          {/* Like */}
          <TouchableOpacity onPress={handleLikePress} style={styles.actionBtn} activeOpacity={0.7}>
            <Animated.Text style={[styles.actionIcon, { transform: [{ scale: likeScale }] }]}>
              {liked ? '❤️' : '🤍'}
            </Animated.Text>
          </TouchableOpacity>
          {/* Comment */}
          <TouchableOpacity onPress={() => setShowCommentInput(s => !s)} style={styles.actionBtn} activeOpacity={0.7}>
            {/* <Text style={styles.actionIcon}>💬</Text> */}
            <Image source={require("../Assests/comment.png") }  style={{height:25,width:25,tintColor: '#FF007F'}} />

          </TouchableOpacity>
          {/* Share */}
          <TouchableOpacity onPress={() => onShare(item)} style={styles.actionBtn} activeOpacity={0.7}>
            {/* <Text style={styles.actionIcon}>↗️</Text> */}
            <Image source={require("../Assests/send.png") }  style={{height:25,width:25,tintColor: '#FF007F'}} />
          </TouchableOpacity>
        </View>
        {/* Save */}
     {/* Save */}
<TouchableOpacity onPress={() => onSave(item._id)} activeOpacity={1}>
  <Image 
    source={saved ? require("../Assests/save.png") : require("../Assests/unsave.png")} 
    style={[styles.actionIconImage, saved && { tintColor: '#FF007F' }]} 
  />
</TouchableOpacity>
      </View>

      {/* ── Like count ── */}
      {(item.likes?.length || 0) > 0 && (
        <Text style={styles.likeCount}>{item.likes.length.toLocaleString()} likes</Text>
      )}

      {/* ── Caption ── */}
      {!!caption && (
        <TouchableOpacity onPress={() => setIsExpanded(e => !e)} activeOpacity={0.9} style={styles.captionRow}>
          <Text style={styles.captionText}>
            <Text style={styles.cardUsername}>{username} </Text>
            <Text style={styles.captionBody}>
              {isLongCaption && !isExpanded ? caption.slice(0, 100) : caption}
            </Text>
            {isLongCaption && !isExpanded && (
              <Text style={styles.moreText}> ...more</Text>
            )}
          </Text>
        </TouchableOpacity>
      )}

      {/* ── Comments preview ── */}
      {item.comments?.length > 0 && (
        <TouchableOpacity onPress={() => setShowAllComments(s => !s)} style={styles.viewCommentsBtn}>
          <Text style={styles.viewCommentsText}>
            {showAllComments ? 'Hide comments' : `View all ${item.comments.length} comments`}
          </Text>
        </TouchableOpacity>
      )}

      {showAllComments && item.comments?.slice(-3).map((c, i) => (
        <View key={i} style={styles.commentRow}>
          <Text style={styles.commentUsername}>{c.userId?.username || 'User'} </Text>
          <Text style={styles.commentBody}>{c.text}</Text>
        </View>
      ))}

      {/* ── Timestamp ── */}
      <Text style={styles.timestampText}>{timeAgo}</Text>

      {/* ── Comment input ── */}
      {showCommentInput && (
        <View style={styles.commentInputRow}>
          <TextInput
            style={styles.commentBox}
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Add a comment..."
            placeholderTextColor="#444"
            returnKeyType="send"
            onSubmitEditing={() => {
              if (commentText.trim()) {
                onComment(item._id, commentText.trim());
                setCommentText('');
              }
            }}
          />
          <TouchableOpacity
            onPress={() => {
              if (commentText.trim()) {
                onComment(item._id, commentText.trim());
                setCommentText('');
              }
            }}
            style={styles.postBtn}
          >
            <Text style={styles.postBtnText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ── Inline Reel Card ──────────────────────────────────────
const InlineReel = ({ item, navigation }) => {
  const [paused, setPaused] = useState(true);
  const videoUrl = item.videoUrl?.startsWith('http') ? item.videoUrl : `${API_BASE_URL}${item.videoUrl}`;
  const username = item.userId?.username || item.userId?.name || 'vRoot';
  const profileUri = item.userId?.profilePic
    ? (item.userId.profilePic.startsWith('http') ? item.userId.profilePic : `${API_BASE_URL}${item.userId.profilePic}`)
    : null;

  return (
    <View style={styles.reelCard}>
      <TouchableOpacity activeOpacity={1} onPress={() => setPaused(p => !p)} style={StyleSheet.absoluteFill}>
        <Video
          source={{ uri: videoUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          repeat
          paused={paused}
        />
        {/* Dark gradient overlay */}
        <View style={styles.reelOverlay} />

        {/* Top label */}
        <View style={styles.reelTopBar}>
          <View style={styles.reelBadge}>
            <Text style={styles.reelBadgeText}>▶  Reel</Text>
          </View>
        </View>

        {/* Play icon */}
        {paused && (
          <View style={styles.playOverlay}>
            <View style={styles.playCircle}>
              <Text style={{ fontSize: 26, color: '#fff', marginLeft: 4 }}>▶</Text>
            </View>
          </View>
        )}

        {/* Bottom info */}
        <View style={styles.reelBottom}>
          <View style={styles.reelUserRow}>
            <Image
              source={profileUri ? { uri: profileUri } : require('../Assests/user.png')}
              style={styles.reelAvatar}
            />
            <Text style={styles.reelUsername}>@{username}</Text>
          </View>
          {!!item.title && <Text style={styles.reelTitle} numberOfLines={2}>{item.title}</Text>}
          {!!(item.description || item.caption) && (
            <Text style={styles.reelDesc} numberOfLines={1}>{item.description || item.caption}</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Watch full reel button */}
      <TouchableOpacity
        style={styles.watchFullBtn}
        onPress={() => navigation.navigate('Reels', { initialIndex: 0, videos: [item] })}
      >
        <Text style={styles.watchFullText}>Watch Full Reel  →</Text>
      </TouchableOpacity>
    </View>
  );
};

// ── Time ago util ─────────────────────────────────────────
const getTimeAgo = (date) => {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(date).toLocaleDateString();
};

// ── More Options Modal ────────────────────────────────────
const MoreOptionsModal = ({ visible, item, myId, onClose, onDelete, onReport }) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose} />
    <View style={styles.optionSheet}>
      <View style={styles.optionHandle} />
      {String(item?.userId?._id || item?.userId) === String(myId) ? (
        <>
          <TouchableOpacity style={styles.optionBtn} onPress={() => { onDelete(item._id); onClose(); }}>
            <Text style={[styles.optionText, { color: '#FF3B30' }]}>🗑  Delete Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBtn} onPress={onClose}>
            <Text style={styles.optionText}>✏️  Edit Caption</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.optionBtn} onPress={() => { onReport(item._id); onClose(); }}>
            <Text style={[styles.optionText, { color: '#FF3B30' }]}>🚩  Report Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBtn} onPress={onClose}>
            <Text style={styles.optionText}>🚫  Not Interested</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity style={[styles.optionBtn, { borderTopWidth: 0.5, borderTopColor: '#222', marginTop: 8 }]} onPress={onClose}>
        <Text style={[styles.optionText, { color: '#888' }]}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

// ── Main Screen ───────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const [feed, setFeed]          = useState([]);
  const [loading, setLoading]    = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const [myId, setMyId]          = useState(null);
  const [stories, setStories]    = useState([]);
  const [moreModal, setMoreModal] = useState({ visible: false, item: null });

  // ── Load feed ────────────────────────────────
  const loadFeed = useCallback(async (isRefresh = false) => {
    try {
      const token = await getToken();

      // My profile
      if (token) {
        const me = await fetch(`${API_BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const meData = await me.json();
        if (meData.success) {
          setMyId(meData.user._id);
          // Use following as stories
          setStories(
            (meData.user.following || []).slice(0, 12).map(u => ({
              name: u.username || u.name || 'User',
              pic: u.profilePic ? (u.profilePic.startsWith('http') ? u.profilePic : `${API_BASE_URL}${u.profilePic}`) : null,
              id: u._id,
            }))
          );
        }
      }

      // Posts + reels in parallel
      const [postRes, reelRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/posts/feed`, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
        fetch(`${API_BASE_URL}/api/video/reels`),
      ]);

      const postData = await postRes.json();
      const reelData = await reelRes.json();

      const posts = postData.success ? (postData.posts || []) : [];
      const reels = Array.isArray(reelData) ? reelData : (reelData.videos || []);

      setFeed(mixFeed(posts, reels));
    } catch (err) {
      console.log('Feed error:', err);
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, []);

  // ✅ Auto-refresh on screen focus with random shuffle
  useFocusEffect(
    useCallback(() => {
      loadFeed();
    }, [loadFeed])
  );

  // ── Handlers ─────────────────────────────────

  const handleLike = async (postId) => {
    // Optimistic update
    setFeed(prev => prev.map(item =>
      item._id === postId ? {
        ...item,
        likes: item.likes?.map(String).includes(String(myId))
          ? item.likes.filter(id => String(id) !== String(myId))
          : [...(item.likes || []), myId]
      } : item
    ));
    try {
      const token = await getToken();
      await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      // Revert on fail
      setFeed(prev => prev.map(item =>
        item._id === postId ? {
          ...item,
          likes: item.likes?.map(String).includes(String(myId))
            ? item.likes.filter(id => String(id) !== String(myId))
            : [...(item.likes || []), myId]
        } : item
      ));
    }
  };

  const handleComment = async (postId, text) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (data.success) {
        setFeed(prev => prev.map(item =>
          item._id === postId ? { ...item, comments: data.comments || item.comments } : item
        ));
      }
    } catch (e) { console.log(e); }
  };

  const handleSave = async (postId) => {
    // Optimistic
    setFeed(prev => prev.map(item =>
      item._id === postId ? {
        ...item,
        savedBy: item.savedBy?.map(String).includes(String(myId))
          ? item.savedBy.filter(id => String(id) !== String(myId))
          : [...(item.savedBy || []), myId]
      } : item
    ));
    try {
      const token = await getToken();
      await fetch(`${API_BASE_URL}/api/posts/${postId}/save`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) { console.log(e); }
  };

  const handleShare = async (item) => {
    try {
      await Share.share({
        message: item.caption
          ? `${item.caption}\n\nShared from vRoot`
          : 'Check this post on vRoot!',
        url: item.imageUrl?.startsWith('http') ? item.imageUrl : `${API_BASE_URL}${item.imageUrl}`,
      });
    } catch (e) { console.log(e); }
  };

  const handleDelete = async (postId) => {
    Alert.alert('Delete Post', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            const token = await getToken();
            await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` }
            });
            setFeed(prev => prev.filter(item => item._id !== postId));
          } catch (e) { console.log(e); }
        }
      }
    ]);
  };

  const handleReport = (postId) => {
    Alert.alert('Report', 'Post has been reported. Thank you!');
  };

  const handleProfile = (userId) => {
    if (!userId) return;
    if (String(userId) === String(myId)) {
      navigation.navigate('ProfileScreen');
    } else {
      navigation.navigate('OtherProfile', { userId });
    }
  };

  const handleMoreOptions = (item) => setMoreModal({ visible: true, item });

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#FF007F" />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.appName}>vRoot</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('SearchScreen')}>
            <Text style={styles.headerIconText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('NotificationScreen')}>
            <Text style={styles.headerIconText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('ChatListScreen')}>
            <Text style={styles.headerIconText}>✉️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={feed}
        keyExtractor={(item, i) => `${item._id || i}-${item._feedType}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefresh(true); loadFeed(true); }}
            tintColor="#FF007F"
            colors={['#FF007F']}
          />
        }
        ListHeaderComponent={
          stories.length > 0 ? (
            <View style={styles.storiesSection}>
              <StoriesBar stories={stories} />
              <View style={styles.divider} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={[styles.center, { marginTop: 80 }]}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>📭</Text>
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubText}>Follow people or upload something!</Text>
            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={() => navigation.navigate('UploadScreen')}
            >
              <Text style={styles.uploadBtnText}>Upload Now</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => {
          if (item._feedType === 'reel') {
            return <InlineReel item={item} navigation={navigation} />;
          }
          return (
            <PostCard
              item={item}
              myId={myId}
              onLike={handleLike}
              onComment={handleComment}
              onSave={handleSave}
              onShare={handleShare}
              onProfile={handleProfile}
              onMoreOptions={handleMoreOptions}
            />
          );
        }}
      />

      {/* More Options Modal */}
      <MoreOptionsModal
        visible={moreModal.visible}
        item={moreModal.item}
        myId={myId}
        onClose={() => setMoreModal({ visible: false, item: null })}
        onDelete={handleDelete}
        onReport={handleReport}
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' },

  // Header
  header: {
    height: 52, backgroundColor: '#0a0a0a',
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderBottomWidth: 0.5, borderBottomColor: '#1a1a1a',
  },
  appName:     { color: '#FF007F', fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerIcon:  { padding: 6 },
  headerIconText: { fontSize: 20 },

  // Stories
  storiesSection: { backgroundColor: '#0a0a0a' },
  storiesBar:     { backgroundColor: '#0a0a0a' },
  storyItem:      { alignItems: 'center', marginRight: 14, width: 68 },
  storyRing:      {
    width: 66, height: 66, borderRadius: 33,
    borderWidth: 2.5, borderColor: '#FF007F',
    padding: 2, marginBottom: 4,
  },
  storyAvatar:    { width: 57, height: 57, borderRadius: 28.5 },
  storyName:      { color: '#ccc', fontSize: 11, textAlign: 'center', width: 68 },
  divider:        { height: 0.5, backgroundColor: '#1a1a1a', marginTop: 4 },

  // Post Card
  card: { backgroundColor: '#0a0a0a', marginBottom: 4 },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12, paddingVertical: 10,
  },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarRing: {
    width: 42, height: 42, borderRadius: 21,
    borderWidth: 2, borderColor: '#FF007F',
    padding: 1.5, marginRight: 10,
  },
  avatar:       { width: 35, height: 35, borderRadius: 17.5 },
  cardUsername: { color: '#fff', fontWeight: '700', fontSize: 13.5 },
  location:     { color: '#888', fontSize: 11, marginTop: 1 },
  timeAgo:      { color: '#555', fontSize: 11, marginTop: 1 },
  moreBtn:      { paddingHorizontal: 8, paddingVertical: 4 },
  moreDots:     { color: '#fff', fontSize: 16, letterSpacing: 1 },

  // Post image
  imageWrapper: { position: 'relative' },
  postImage:    { width, height: width, backgroundColor: '#111' },
  floatingHeart: {
    position: 'absolute', top: '50%', left: '50%',
    marginLeft: -40, marginTop: -40,
    zIndex: 10,
  },

  // Actions
  actionsRow:  { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center' },
  leftActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionBtn:   { padding: 4 },
  actionIcon:  { fontSize: 27 },

  // Post info
  likeCount:    { color: '#fff', fontWeight: '700', fontSize: 13.5, paddingHorizontal: 12, marginBottom: 5 },
  captionRow:   { paddingHorizontal: 12, marginBottom: 5 },
  captionText:  { color: '#ccc', lineHeight: 19, fontSize: 13.5 },
  captionBody:  { color: '#ccc' },
  moreText:     { color: '#888', fontSize: 13 },
  viewCommentsBtn: { paddingHorizontal: 12, marginBottom: 4 },
  viewCommentsText:{ color: '#888', fontSize: 13 },
  commentRow:   { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, marginBottom: 2 },
  commentUsername: { color: '#fff', fontWeight: '700', fontSize: 13 },
  commentBody:  { color: '#aaa', fontSize: 13, flexShrink: 1 },
  timestampText:{ color: '#444', fontSize: 11, paddingHorizontal: 12, marginBottom: 8, marginTop: 2 },

  // Comment input
  commentInputRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 8,
    borderTopWidth: 0.5, borderTopColor: '#1a1a1a',
    backgroundColor: '#0d0d0d',
  },
  commentBox: {
    flex: 1, color: '#fff', fontSize: 13.5,
    backgroundColor: '#1a1a1a', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    marginRight: 10,
  },
  postBtn:     { paddingHorizontal: 4 },
  postBtnText: { color: '#FF007F', fontWeight: '700', fontSize: 14 },

  // Inline Reel
  reelCard: {
    height: 500, backgroundColor: '#111',
    marginBottom: 4, position: 'relative', overflow: 'hidden',
  },
  reelOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  reelTopBar: {
    position: 'absolute', top: 14, left: 14,
    flexDirection: 'row', alignItems: 'center',
  },
  reelBadge: {
    backgroundColor: 'rgba(255,0,127,0.85)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  reelBadgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  playOverlay:   { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  playCircle:    {
    width: 62, height: 62, borderRadius: 31,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)',
  },
  reelBottom: { position: 'absolute', bottom: 52, left: 14, right: 60 },
  reelUserRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  reelAvatar: { width: 30, height: 30, borderRadius: 15, marginRight: 8, borderWidth: 1.5, borderColor: '#fff' },
  reelUsername: { color: '#fff', fontWeight: '700', fontSize: 13.5 },
  reelTitle:    { color: '#fff', fontWeight: '800', fontSize: 15, marginBottom: 3 },
  reelDesc:     { color: '#ccc', fontSize: 13 },
  watchFullBtn: {
    position: 'absolute', bottom: 12, left: 14, right: 14,
    backgroundColor: 'rgba(255,0,127,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,0,127,0.5)',
    borderRadius: 10, paddingVertical: 10, alignItems: 'center',
  },
  watchFullText: { color: '#FF007F', fontWeight: '700', fontSize: 13 },

  // Empty state
  emptyText:    { color: '#555', fontSize: 17, fontWeight: '700' },
  emptySubText: { color: '#333', fontSize: 13, marginTop: 4, marginBottom: 20 },
  uploadBtn:    { backgroundColor: '#FF007F', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 22 },
  uploadBtnText:{ color: '#fff', fontWeight: '700', fontSize: 14 },

  // More options modal
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  optionSheet: {
    backgroundColor: '#141414',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingBottom: 32, paddingTop: 12,
  },
  optionHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#333', alignSelf: 'center', marginBottom: 16,
  },
  optionBtn:  { paddingVertical: 16 },
  optionText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  actionIconImage: {
  height: 23,
  width: 23,
  tintColor: '#FF007F' 
  // Remove tintColor from here if you want dynamic coloring
}
});
