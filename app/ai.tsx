import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Progress from 'react-native-progress';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons, Feather } from '@expo/vector-icons';
import { generateImageFromPrompt } from '../lib/huggingface';

export default function AIScreen() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt) {
      Alert.alert('Prompt required', 'Please enter a prompt to generate.');
      return;
    }
    
    setLoading(true);
    setImageUrl('');
    setError('');
    
    try {
      const url = await generateImageFromPrompt(prompt);
      setImageUrl(url);
    } catch (err: any) {
      console.error('Generation error:', err);
      Alert.alert(
        'Error',
        err.message || 'Failed to generate image. Please try again.'
      );
      setError(err.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    const filename = FileSystem.documentDirectory + 'wallpaper.jpg';
    const downloadResumable = FileSystem.createDownloadResumable(imageUrl, filename);

    try {
      const { uri } = await downloadResumable.downloadAsync();
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.granted) {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('Success', 'Image saved to gallery.');
      } else {
        Alert.alert('Permission denied', 'Cannot save without permission.');
      }
    } catch (error) {
      Alert.alert('Download failed', 'Could not save image.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎨 AI Image Generator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a prompt (e.g., futuristic city at night)..."
        placeholderTextColor="#aaa"
        value={prompt}
        onChangeText={setPrompt}
        multiline
      />

      <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
        {loading ? (
          <View style={{ alignItems: 'center' }}>
            <ActivityIndicator color="#fff" />
            <Progress.Bar
              indeterminate
              width={160}
              color="#60a5fa"
              style={{ marginTop: 10 }}
              borderColor="#3b82f6"
            />
          </View>
        ) : (
          <Text style={styles.generateText}>Generate</Text>
        )}
      </TouchableOpacity>

      {imageUrl !== '' && (
        <View style={styles.imageSection}>
          <Image source={{ uri: imageUrl }} style={styles.image} />

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleDownload}>
              <Feather name="download" size={20} color="#fff" />
              <Text style={styles.actionText}>Download</Text>
            </TouchableOpacity>

            {/* Placeholder for Set Wallpaper */}
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#22c55e' }]}
              onPress={() => Alert.alert('Set Wallpaper', 'Custom logic can go here!')}>
              <Ionicons name="color-wand" size={20} color="#fff" />
              <Text style={styles.actionText}>Set Wallpaper</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#0f172a',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1e293b',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  generateBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  generateText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageSection: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
    borderRadius: 15,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
});
