import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, Image,
  Dimensions, StyleSheet, StatusBar, Keyboard, TouchableWithoutFeedback,
  ActivityIndicator, ScrollView, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router'; // ✅ NEW
import { Ionicons } from '@expo/vector-icons';

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
  const { category } = useLocalSearchParams(); // ✅ NEW

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

  // 🔁 Fetch on first load
  useEffect(() => {
    fetchWallpapers();
  }, []);

  // ✅ Fetch when category is passed via router
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
        colors={['#0f2027', '#203a43', '#2c5364']}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* App Name */}
          <View style={styles.appHeader}>
            <Text style={styles.appName}>🌟 Wallx</Text>
          </View>

          {/* Search */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#ccc" />
            <TextInput
              style={styles.input}
              placeholder="Search For Wallpapers"
              placeholderTextColor="#ccc"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>

          {/* AI Banner */}
          <TouchableOpacity onPress={generateWithAI} style={styles.aiBanner}>
            <Image
              source={require('../assets/images/ai-banner.png')}
              style={styles.bannerImage}
            />
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
            <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
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
  // ... [Same styles as before]
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
    color: '#fff',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 8,
  },
  searchBar: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 20,
  },
  input: {
    color: '#fff',
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },
  aiBanner: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  bannerImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  seeMore: {
    color: '#ccc',
    fontSize: 14,
  },
  categoryList: {
    marginVertical: 12,
  },
  categoryCard: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginRight: 10,
  },
  categoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  wallpaperCard: {
    width: (screenWidth - 48) / 2,
    height: 300,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  wallpaperImage: {
    width: '100%',
    height: '100%',
  },
});

export default Home;
