import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function WallpaperScreen() {
  const { image, description } = useLocalSearchParams();
  const router = useRouter();

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkIfFavorite();
  }, [image]);

  const checkIfFavorite = async () => {
    const storedFavorites = await AsyncStorage.getItem('favorites');
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    const exists = favorites.some((fav: any) => fav.image === image);
    setIsFavorite(exists);
  };

  const toggleFavorite = async () => {
    const storedFavorites = await AsyncStorage.getItem('favorites');
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

    if (isFavorite) {
      favorites = favorites.filter((fav: any) => fav.image !== image);
      setIsFavorite(false);
    } else {
      favorites.push({ image, description });
      setIsFavorite(true);
    }

    await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  };

  const shareImage = async () => {
    try {
      const fileUri = FileSystem.cacheDirectory + 'shared-wallpaper.jpg';
      const { uri } = await FileSystem.downloadAsync(image as string, fileUri);
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  const downloadImage = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + 'downloaded-wallpaper.jpg';
      const { uri } = await FileSystem.downloadAsync(image as string, fileUri);
      const permission = await MediaLibrary.requestPermissionsAsync();

      if (permission.granted) {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('Downloaded', 'Image has been saved to your gallery!');
      } else {
        Alert.alert('Permission denied', 'Cannot save without gallery access.');
      }
    } catch (error) {
      Alert.alert('Download failed', 'Something went wrong while downloading the image.');
    }
  };

  return (
    <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>{description || 'Wallpaper Preview'}</Text>

        <View style={styles.imageContainer}>
          <Image source={{ uri: image as string }} style={styles.image} />
        </View>

        <View style={styles.buttonContainer}>
          {/* Share Button */}
          <TouchableOpacity style={styles.iconButton} onPress={shareImage}>
            <Feather name="share-2" size={22} color="white" />
            <Text style={styles.iconText}>Share</Text>
          </TouchableOpacity>

          {/* Download Button */}
          <TouchableOpacity style={styles.iconButton} onPress={downloadImage}>
            <MaterialIcons name="file-download" size={24} color="white" />
            <Text style={styles.iconText}>Download</Text>
          </TouchableOpacity>

          {/* Set Placeholder */}
          <TouchableOpacity style={styles.setButton} onPress={() => Alert.alert('Set Wallpaper', 'This feature will be implemented soon!')}>
            <Ionicons name="color-wand-outline" size={26} color="white" />
            <Text style={styles.iconText}>Set</Text>
          </TouchableOpacity>

          {/* Favorite Toggle */}
          <TouchableOpacity style={styles.iconButton} onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? 'red' : 'white'}
            />
            <Text style={styles.iconText}>Favorite</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 60 : 20,
    paddingBottom: 100,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 50 : 20,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 30,
    flexWrap: 'wrap',
    gap: 10,
  },
  iconButton: {
    alignItems: 'center',
  },
  setButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 18,
    borderRadius: 50,
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
});
