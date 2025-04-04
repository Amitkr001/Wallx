import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Image, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';

export default function WallpaperScreen() {
  const { image, description } = useLocalSearchParams();
  const router = useRouter();

  // Share image function
  const shareImage = async () => {
    try {
      const fileUri = FileSystem.cacheDirectory + 'shared-wallpaper.jpg';
      const { uri } = await FileSystem.downloadAsync(image as string, fileUri);
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  return (
    <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      {/* Wallpaper Title */}
      <Text style={styles.title}>{description || 'Wallpaper Preview'}</Text>

      {/* Image Display */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: image as string }} style={styles.image} />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={shareImage}>
          <Feather name="share-2" size={22} color="white" />
          <Text style={styles.iconText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.setButton}>
          <Ionicons name="color-wand-outline" size={26} color="white" />
          <Text style={styles.iconText}>Set</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="heart-outline" size={22} color="white" />
          <Text style={styles.iconText}>Favorite</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '90%',
    borderRadius: 20,
    resizeMode: 'cover',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 30,
    marginBottom: 20,
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
