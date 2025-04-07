import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, Image,
  Dimensions, StyleSheet, StatusBar, Keyboard, TouchableWithoutFeedback,
  ActivityIndicator, ScrollView, Platform, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const ACCESS_KEY = 'FdYuWIiLfuqafC3kBGEHlysxTUO02U6y0KMmd9h7Be0';
const SEARCH_API = 'https://api.unsplash.com/search/photos';

const POPULAR_CATEGORIES = [
  { name: 'Abstract', color: '#007cf0' },
  { name: 'Aesthetic', color: '#7928ca' },
  { name: 'Nature', color: '#0f9d58' },
  { name: 'Space', color: '#8e24aa' },
];

const screenWidth = Dimensions.get('window').width;
const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 20;

const Home = () => {
  const router = useRouter();
  const { category } = useLocalSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWallpapers = async (query = 'trending') => {
    try {
      setLoading(true);
      const response = await axios.get(SEARCH_API, {
        params: { query, per_page: 20 },
        headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
      });
      setWallpapers(response.data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallpapers();
  }, []);

  useEffect(() => {
    if (category) {
      setSearchQuery(String(category));
      fetchWallpapers(String(category));
    }
  }, [category]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      Keyboard.dismiss();
      fetchWallpapers(searchQuery.trim());
    }
  };

  const handleCategoryPress = (cat: string) => {
    fetchWallpapers(cat);
  };

  const handleWallpaperPress = (img: string) => {
    router.push({ pathname: '/wallpaper', params: { image: img } });
  };

  const generateWithAI = () => {
    router.push('/ai');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#0A192F', '#112240', '#1D3461']}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* App Name */}
          <View style={styles.appHeader}>
            <Text style={styles.appName}>🌟 Wallx</Text>
          </View>

          {/* Search */}
          <BlurView intensity={20} tint="dark" style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#64FFDA" />
            <TextInput
              style={styles.input}
              placeholder="Search For Wallpapers"
              placeholderTextColor="#8892B0"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </BlurView>

          {/* AI Banner */}
          <TouchableOpacity onPress={generateWithAI} style={styles.aiBanner}>
            <LinearGradient
              colors={['#00C6FF', '#0072FF']}
              style={styles.bannerGradient}
            >
              <Image
                source={require('../assets/images/ai-banner.png')}
                style={styles.bannerImage}
              />
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerText}>Generate Wallpapers with AI</Text>
                <Text style={styles.bannerSubText}>Create unique wallpapers instantly</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Popular Categories */}
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Popular Categories 🔥</Text>
            <TouchableOpacity onPress={() => router.push('/category')}>
              <Text style={styles.seeMore}>See More →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
            {POPULAR_CATEGORIES.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={[styles.categoryCard, { backgroundColor: item.color }]}
                onPress={() => handleCategoryPress(item.name)}
              >
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Wallpapers */}
          {loading ? (
            <ActivityIndicator size="large" color="#64FFDA" style={{ marginTop: 50 }} />
          ) : (
            <FlatList
              data={wallpapers}
              numColumns={2}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              contentContainerStyle={{ paddingBottom: 120 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.wallpaperCard}
                  onPress={() => handleWallpaperPress(item.urls.full)}
                >
                  <Image source={{ uri: item.urls.small }} style={styles.wallpaperImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.wallpaperOverlay}
                  >
                    <Text style={styles.wallpaperTitle} numberOfLines={1}>
                      {item.alt_description || 'Wallpaper'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            />
          )}
        </ScrollView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: statusBarHeight + 8,
    paddingHorizontal: 16,
  },
  appHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#64FFDA',
    letterSpacing: 2,
    textShadowColor: 'rgba(100, 255, 218, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  searchBar: {
    backgroundColor: 'rgba(10, 25, 47, 0.7)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.1)',
  },
  input: {
    color: '#E6F1FF',
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
  },
  aiBanner: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#00C6FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bannerGradient: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  bannerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerSubText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    color: '#E6F1FF',
    fontSize: 20,
    fontWeight: '700',
  },
  seeMore: {
    color: '#64FFDA',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryList: {
    marginVertical: 12,
  },
  categoryCard: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    marginRight: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  wallpaperCard: {
    width: (screenWidth - 48) / 2,
    height: 300,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#112240',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  wallpaperImage: {
    width: '100%',
    height: '100%',
  },
  wallpaperOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  wallpaperTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Home;
