import React, { useState } from 'react';
import {
    View, Alert, TouchableOpacity, StyleSheet, Text,
    TextInput, ActivityIndicator, ScrollView, Image
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Video from 'react-native-video';
import { API_BASE_URL } from '../config/config';
import { getToken, getUser } from '../services/authStorage'; // ✅

const categories = ['Comedy', 'Dance', 'Travel', 'Vlog', 'Food', 'Fitness'];

const UploadReelScreen = ({ navigation }) => {
    const [video, setVideo]           = useState(null);
    const [title, setTitle]           = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory]     = useState('');
    const [tags, setTags]             = useState('');
    const [isPublic, setIsPublic]     = useState(true);
    const [uploading, setUploading]   = useState(false);

    const pickVideo = async () => {
        try {
            const result = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.video],
            });
            setVideo(result);
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) {
                console.error("Error picking video:", err);
            }
        }
    };

    const uploadVideo = async () => {
        if (!video)  return Alert.alert("Select a video first");
        if (!title)  return Alert.alert("Add a title");

        setUploading(true);
        try {
            const token = await getToken();  // ✅ JWT token
            const user  = await getUser();   // ✅ saved user

            console.log('Uploading reel for userId:', user?._id);

            const formData = new FormData();
            formData.append("video", {
                uri:  video.fileCopyUri || video.uri,
                type: video.type,
                name: video.name,
            });
            formData.append("title",       title);
            formData.append("description", description);
            formData.append("category",    category);
            formData.append("tags",        tags);
            formData.append("type",        "reel");
            formData.append("isPublic",    isPublic.toString());
            // ✅ userId sahi se ja raha hai — hardcoded "123" nahi
            formData.append("userId",      user?._id || '');

            const res = await fetch(`${API_BASE_URL}/api/video/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ auth header
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const data = await res.json();
            console.log('Upload response:', data);

            if (data.success) {
                Alert.alert("✅ Uploaded!", "Reel uploaded successfully!", [
                    { text: 'OK', onPress: () => { resetForm(); navigation?.goBack(); } }
                ]);
            } else {
                Alert.alert("Error", data.message || "Upload failed");
            }
        } catch (err) {
            console.log('Upload error:', err);
            Alert.alert("Error", "Upload failed");
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
        <View style={{ flex: 1, backgroundColor: '#000' }}>

            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation?.goBack()} style={{ padding: 10 }}>
                    <Text style={{ color: '#fff', fontSize: 20 }}>←</Text>
                </TouchableOpacity>
                <Image source={require('../Assests/logos.png')} style={styles.logo} />
                <Text style={styles.appName}>Upload Reel</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                {/* Pick Video */}
                <TouchableOpacity style={styles.pickBtn} onPress={pickVideo}>
                    <Text style={styles.pickEmoji}>🎬</Text>
                    <Text style={styles.pickText}>{video ? 'Change Video' : 'Pick a Video'}</Text>
                </TouchableOpacity>

                {/* Preview */}
                {video && (
                    <>
                        <Text style={styles.fileName}>🎞 {video.name}</Text>
                        <Video
                            source={{ uri: video.uri }}
                            style={styles.preview}
                            resizeMode="cover"
                            repeat
                            paused={false}
                        />
                    </>
                )}

                {/* Title */}
                <TextInput
                    style={styles.input}
                    placeholder="Reel Title *"
                    placeholderTextColor="#555"
                    value={title}
                    onChangeText={setTitle}
                />

                {/* Description */}
                <TextInput
                    style={[styles.input, { height: 90 }]}
                    placeholder="Description (optional)"
                    placeholderTextColor="#555"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                {/* Category */}
                <Text style={styles.label}>Category</Text>
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

                {/* Tags */}
                <TextInput
                    style={styles.input}
                    placeholder="Tags (e.g. funny, viral)"
                    placeholderTextColor="#555"
                    value={tags}
                    onChangeText={setTags}
                />

                {/* Public / Private */}
                <TouchableOpacity
                    style={[styles.visibilityBtn, { backgroundColor: isPublic ? '#1a6b3a' : '#6b1a1a' }]}
                    onPress={() => setIsPublic(!isPublic)}
                >
                    <Text style={styles.saveText}>{isPublic ? '🌍 Public' : '🔒 Private'}</Text>
                </TouchableOpacity>

                {/* Upload Button */}
                <TouchableOpacity style={styles.saveButton} onPress={uploadVideo} disabled={uploading}>
                    {uploading
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.saveText}>Upload Reel 🚀</Text>
                    }
                </TouchableOpacity>

                {/* Reset */}
                <TouchableOpacity style={[styles.saveButton, { backgroundColor: '#333' }]} onPress={resetForm}>
                    <Text style={styles.saveText}>Reset</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

export default UploadReelScreen;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#FF007F',
        paddingVertical: 6,
        paddingTop: 44,
    },
    logo:    { width: 36, height: 36, borderRadius: 8, marginRight: 8 },
    appName: { fontSize: 20, fontWeight: 'bold', color: '#FF007F' },

    container: { padding: 16, backgroundColor: '#000', flexGrow: 1 },

    pickBtn: {
        borderWidth: 1.5, borderColor: '#FF007F', borderStyle: 'dashed',
        borderRadius: 12, paddingVertical: 24, alignItems: 'center', marginBottom: 16,
    },
    pickEmoji: { fontSize: 36, marginBottom: 6 },
    pickText:  { color: '#FF007F', fontWeight: '700', fontSize: 16 },

    fileName: { color: '#aaa', marginBottom: 8 },
    preview:  { width: '100%', height: 220, borderRadius: 10, backgroundColor: '#111', marginBottom: 16 },

    input: {
        backgroundColor: '#1a1a1a', color: '#fff',
        padding: 12, borderRadius: 10, marginBottom: 12, fontSize: 15,
    },
    label: { color: '#aaa', marginBottom: 8, fontWeight: '600' },

    chipContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 },
    chip:          { backgroundColor: '#222', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, margin: 4 },
    chipSelected:  { backgroundColor: '#FF007F' },
    chipText:      { color: '#fff', fontSize: 13 },

    visibilityBtn: { paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
    saveButton:    { backgroundColor: '#FF007F', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
    saveText:      { color: '#fff', fontSize: 16, fontWeight: '700' },
});