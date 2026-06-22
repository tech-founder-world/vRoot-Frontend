import React, { useState } from 'react';
import {
  View, Alert, TouchableOpacity, Text,
  TextInput, ActivityIndicator, ScrollView, Image,StyleSheet
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Video from 'react-native-video';
import { API_BASE_URL } from '../config/config';

const categories = ['Comedy', 'Dance', 'Travel', 'Vlog', 'Food', 'Fitness'];

const UploadLongVideoScreen = () => {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [uploading, setUploading] = useState(false);

  const USER_ID = "1234567890"; // 🔴 replace with real logged-in user id

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.video],
      });
      setVideo(result);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error("Video pick error:", err);
      }
    }
  };

  const uploadLongVideo = async () => {
    if (!video || !title.trim() || !category) {
      return Alert.alert("Missing Info", "Video, title & category are required.");
    }

    const formData = new FormData();

    formData.append("video", {
      uri: video.fileCopyUri || video.uri,
      type: video.type || "video/mp4",
      name: video.name || `video_${Date.now()}.mp4`,
    });

    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("isPublic", isPublic);
    formData.append("type", "long"); // 🔥 YOUTUBE VIDEO
    formData.append("userId", USER_ID);

    setUploading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/video/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("✅ Success", "Video uploaded successfully");
        resetForm();
      } else {
        Alert.alert("❌ Failed", data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setVideo(null);
    setTitle('');
    setDescription('');
    setCategory('');
    setTags('');
    setIsPublic(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={styles.headerContainer}>
        <Image source={require('../Assests/logos.png')} style={styles.logo} />
        <Text style={styles.appName}>vRoot</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Upload Long Video</Text>

        <TouchableOpacity style={styles.saveButton} onPress={pickVideo}>
          <Text style={styles.saveText}>Pick Video</Text>
        </TouchableOpacity>

        {video && (
          <>
            <Text style={styles.fileName}>🎞 {video.name}</Text>
            <Video
              source={{ uri: video.uri }}
              style={styles.preview}
              resizeMode="cover"
            />
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Video Title"
          placeholderTextColor="#aaa"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, { height: 90 }]}
          placeholder="Description"
          placeholderTextColor="#aaa"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Select Category</Text>
        <View style={styles.chipContainer}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, category === cat && styles.chipSelected]}
              onPress={() => setCategory(cat)}
            >
              <Text style={styles.chipText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Tags (comma separated)"
          placeholderTextColor="#aaa"
          value={tags}
          onChangeText={setTags}
        />

        <TouchableOpacity
          style={[styles.visibilityButton, isPublic ? styles.public : styles.private]}
          onPress={() => setIsPublic(!isPublic)}
        >
          <Text style={styles.saveText}>
            {isPublic ? "🌍 Public" : "🔒 Private"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={uploadLongVideo}
          disabled={uploading}
        >
          {uploading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveText}>Upload Video</Text>}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default UploadLongVideoScreen;


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#000',
    flexGrow: 1,
  },

  /* ---------- HEADER ---------- */
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },

  logo: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginRight: 10,
  },

  appName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF0055',
    letterSpacing: 1,
  },

  /* ---------- TITLE ---------- */
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },

  /* ---------- INPUTS ---------- */
  input: {
    backgroundColor: '#111',
    color: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#222',
  },

  /* ---------- BUTTONS ---------- */
  saveButton: {
    backgroundColor: '#FF0055',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 10,
  },

  saveText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },

  /* ---------- VIDEO ---------- */
  fileName: {
    color: '#aaa',
    marginBottom: 8,
    fontSize: 14,
  },

  preview: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    backgroundColor: '#111',
    marginBottom: 16,
  },

  /* ---------- CATEGORY ---------- */
  label: {
    color: '#fff',
    marginBottom: 10,
    fontWeight: '600',
    fontSize: 16,
  },

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },

  chip: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 6,
    borderWidth: 1,
    borderColor: '#333',
  },

  chipSelected: {
    backgroundColor: '#FF0055',
    borderColor: '#FF0055',
  },

  chipText: {
    color: '#fff',
    fontSize: 14,
  },

  /* ---------- VISIBILITY ---------- */
  visibilityButton: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 12,
  },

  public: {
    backgroundColor: '#1e7f4f',
  },

  private: {
    backgroundColor: '#7f1e1e',
  },
});
