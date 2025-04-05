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
    const updatedFavorites = favorites.filter((fav: any) => fav.image !== itemToRemove.image);
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  if (favorites.length === 0) {
    return (
      <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.emptyContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.emptyText}>No favorites yet 🥲</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.heading}>❤️ Your Favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <TouchableOpacity style={styles.card} onPress={() => openWallpaper(item)}>
              <Image source={{ uri: item.image }} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeFromFavorites(item)}
            >
              <Ionicons name="trash-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  cardWrapper: {
    width: (screenWidth - 48) / 2,
    marginBottom: 16,
    position: 'relative',
  },
  card: {
    width: '100%',
    height: 300,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,0,0,0.6)',
    padding: 6,
    borderRadius: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f2027',
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
