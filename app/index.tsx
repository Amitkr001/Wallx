import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const UNSPLASH_API = 'https://api.unsplash.com/search/photos';
const ACCESS_KEY = 'FdYuWIiLfuqafC3kBGEHlysxTUO02U6y0KMmd9h7Be0';

export default function Home() {
  const [wallpapers, setWallpapers] = useState([]);
  const [query, setQuery] = useState('nature');
  const router = useRouter();

  const fetchWallpapers = async (searchQuery: string) => {
    try {
      const response = await axios.get(UNSPLASH_API, {
        params: { query: searchQuery, per_page: 30 },
        headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
      });
      setWallpapers(response.data.results);
    } catch (error) {
      console.error('Error fetching wallpapers:', error);
    }
  };

  useEffect(() => {
    fetchWallpapers(query);
  }, []);

  const handleImagePress = (item: any) => {
    router.push({ pathname: '/wallpaper', params: { image: item.urls.full } });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        {/* Set StatusBar dark content to light for better visibility */}
        <StatusBar barStyle="light-content" backgroundColor="#0f2027" />

        <LinearGradient
          colors={['#0f2027', '#203a43', '#2c5364']}
          style={styles.container}
        >
          <Text style={styles.heading}>✨ Explore Wallpapers</Text>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search wallpapers..."
              placeholderTextColor="#ccc"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => fetchWallpapers(query)}
            />
          </View>

          <FlatList
            data={wallpapers}
            numColumns={2}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleImagePress(item)}
              >
                <Image source={{ uri: item.urls.small }} style={styles.image} />
              </TouchableOpacity>
            )}
          />
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  searchContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchInput: {
    height: 44,
    fontSize: 16,
    color: '#fff',
  },
  card: {
    width: (screenWidth - 48) / 2,
    height: 360, // ⬆️ Increased height
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
