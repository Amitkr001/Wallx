import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
  Dimensions, StatusBar, Platform, Share, ActivityIndicator,
  ScrollView, Alert, Linking, Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SetWallpaper from 'react-native-set-wallpaper';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 20;

const WallpaperScreen = () => {
  const router = useRouter();
  const { image, description } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkIfFavorite();
  }, [image]);

  const checkIfFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites) {
        const parsedFavorites = JSON.parse(favorites);
        const exists = parsedFavorites.some((fav: any) => fav.image === image);
        setIsFavorite(exists);
      }
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      let updatedFavorites = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        updatedFavorites = updatedFavorites.filter((fav: any) => fav.image !== image);
        setIsFavorite(false);
        Alert.alert('Removed from Favorites');
      } else {
        updatedFavorites.push({ image, description });
        setIsFavorite(true);
        Alert.alert('Added to Favorites');
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this amazing wallpaper!',
        url: image as string,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status === 'granted') {
        const fileUri = FileSystem.documentDirectory + 'wallpaper.jpg';
        const { uri } = await FileSystem.downloadAsync(image as string, fileUri);
        await MediaLibrary.saveToLibraryAsync(uri);
        setSaved(true);
        Alert.alert('Success', 'Wallpaper saved to gallery!');
      }
    } catch (error) {
      console.error('Error saving:', error);
      Alert.alert('Error', 'Failed to save wallpaper');
    } finally {
      setLoading(false);
    }
  };

  const handleSetWallpaper = async () => {
    try {
      setLoading(true);
      
      // Download the image first
      const fileUri = `${FileSystem.cacheDirectory}wallpaper.jpg`;
      const { uri } = await FileSystem.downloadAsync(
        image as string,
        fileUri
      );

      if (Platform.OS === 'android') {
        try {
          // For Android - Set both home and lock screen
          await SetWallpaper.setWallpaper(
            { uri },
            'both' // 'home' or 'lock' or 'both'
          );
          
          Alert.alert(
            'Success',
            'Wallpaper set successfully!',
            [{ text: 'OK' }]
          );
        } catch (error) {
          console.error('Android wallpaper error:', error);
          // Fallback to saving to gallery
          const permission = await MediaLibrary.requestPermissionsAsync();
          if (permission.status === 'granted') {
            const asset = await MediaLibrary.createAssetAsync(uri);
            await MediaLibrary.saveToLibraryAsync(asset.uri);
            
            Alert.alert(
              'Success',
              'Wallpaper saved to your gallery. Please set it from your device settings.',
              [
                {
                  text: 'Open Settings',
                  onPress: () => Linking.openSettings(),
                },
                { text: 'OK' }
              ]
            );
          } else {
            throw new Error('Permission denied');
          }
        }
      } else {
        // For iOS
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (permission.status === 'granted') {
          const asset = await MediaLibrary.createAssetAsync(uri);
          await MediaLibrary.saveToLibraryAsync(asset.uri);
          
          Alert.alert(
            'Success',
            'Wallpaper saved to your photos. Please set it from your device settings.',
            [
              {
                text: 'Open Settings',
                onPress: () => Linking.openURL('app-settings:'),
              },
              { text: 'OK' }
            ]
          );
        } else {
          Alert.alert(
            'Permission Required',
            'Please grant photo library access to set wallpapers.',
            [
              {
                text: 'Open Settings',
                onPress: () => Linking.openURL('app-settings:'),
              },
              { text: 'Cancel' }
            ]
          );
        }
      }
    } catch (error) {
      console.error('Error setting wallpaper:', error);
      Alert.alert(
        'Error',
        'Failed to set wallpaper. The image has been saved to your gallery. Please set it manually from your device settings.',
        [
          {
            text: 'Open Settings',
            onPress: () => Platform.OS === 'ios' 
              ? Linking.openURL('app-settings:')
              : Linking.openSettings(),
          },
          { text: 'OK' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#64FFDA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallpaper</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.headerFavoriteButton, isFavorite && styles.favoritedButton]}
            onPress={toggleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#FF4081" : "#64FFDA"} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={() => setShowOptions(true)}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="#64FFDA" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Wallpaper Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image as string }}
          style={styles.wallpaperImage}
          resizeMode="cover"
        />
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.actionButton, styles.favoriteButton]}
          onPress={toggleFavorite}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? "#FF4081" : "#64FFDA"} 
          />
          <Text style={styles.buttonText}>
            {isFavorite ? 'Favorited' : 'Favorite'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.downloadButton]}
          onPress={handleSave}
        >
          <Ionicons name="download" size={24} color="#64FFDA" />
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.setButton]}
          onPress={handleSetWallpaper}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#64FFDA" />
          ) : (
            <>
              <Ionicons name="phone-portrait" size={24} color="#64FFDA" />
              <Text style={styles.buttonText}>Set Wallpaper</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Options Menu */}
      <Modal
        visible={showOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.optionsMenu}>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setShowOptions(false);
                toggleFavorite();
              }}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#FF4081" : "#64FFDA"} 
              />
              <Text style={styles.optionText}>
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setShowOptions(false);
                handleSave();
              }}
            >
              <Ionicons name="download" size={24} color="#64FFDA" />
              <Text style={styles.optionText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setShowOptions(false);
                handleSetWallpaper();
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#64FFDA" />
              ) : (
                <>
                  <Ionicons name="phone-portrait" size={24} color="#64FFDA" />
                  <Text style={styles.optionText}>Set as Wallpaper</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setShowOptions(false);
                handleShare();
              }}
            >
              <Ionicons name="share-social" size={24} color="#64FFDA" />
              <Text style={styles.optionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E6F1FF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerFavoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  favoritedButton: {
    backgroundColor: 'rgba(255, 64, 129, 0.1)',
  },
  optionsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  wallpaperImage: {
    width: '100%',
    height: '100%',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(10, 25, 47, 0.9)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: 16,
    marginBottom: Platform.OS === 'ios' ? 90 : 80,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
  },
  favoriteButton: {
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
  },
  downloadButton: {
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
  },
  setButton: {
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
  },
  buttonText: {
    color: '#64FFDA',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  optionsMenu: {
    backgroundColor: 'rgba(10, 25, 47, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  optionText: {
    color: '#E6F1FF',
    fontSize: 16,
    marginLeft: 16,
  },
});

export default WallpaperScreen;
