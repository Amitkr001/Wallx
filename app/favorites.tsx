import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const loadFavorites = async () => {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        const favs = storedFavorites ? JSON.parse(storedFavorites) : [];
        setFavorites(favs);
      };
      
      loadFavorites();
    }, [])
  );

  const openWallpaper = (item: any) => {
    router.push({
      pathname: '/wallpaper',
      params: {
        image: item.image,
        description: item.description || 'Favorite Wallpaper',
      },
    });
  };

  const removeFromFavorites = async (itemToRemove: any) => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this wallpaper from favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          onPress: async () => {
            const updatedFavorites = favorites.filter((fav: any) => fav.image !== itemToRemove.image);
            setFavorites(updatedFavorites);
            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
          },
          style: 'destructive'
        }
      ]
    );
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Favorites</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#64FFDA" />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubText}>Your favorite wallpapers will appear here</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.browseButtonText}>Browse Wallpapers</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => openWallpaper(item)}
            activeOpacity={0.7}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.cardOverlay}
            >
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromFavorites(item)}
              >
                <Ionicons name="heart" size={20} color="#FF4081" />
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight! + 10,
    paddingBottom: 15,
    paddingHorizontal: 16,
    backgroundColor: '#0A192F',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E6F1FF',
  },
  gridContainer: {
    padding: 8,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    padding: 8,
  },
  card: {
    width: (screenWidth - 48) / 2,
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1E2D3D',
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 64, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E6F1FF',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 16,
    color: '#8892B0',
    textAlign: 'center',
    marginTop: 8,
  },
  browseButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#64FFDA',
  },
  browseButtonText: {
    color: '#64FFDA',
    fontSize: 16,
    fontWeight: '600',
  },
});
