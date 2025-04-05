import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

// Category data with local images
const categories = [
  { name: '🌿 Nature', query: 'nature', image: require('../assets/images/night-3078326_640.jpg') },
  { name: '💻 Technology', query: 'technology', image: require('../assets/images/computer-3923644_640.jpg') },
  { name: '🐶 Animals', query: 'animals', image: require('../assets/images/animal-4436913_640.jpg') },
  { name: '🚗 Cars', query: 'cars', image: require('../assets/images/car-63930_640.jpg') },
  { name: '✈️ Travel', query: 'travel', image: require('../assets/images/boat-8002718_640.jpg') },
  { name: '🌌 Space', query: 'space', image: require('../assets/images/astronomy-3214557_640.jpg') },
  { name: '🏙️ City', query: 'city', image: require('../assets/images/streets-7683842_640.jpg') },
  { name: '⛰️ Mountains', query: 'mountains', image: require('../assets/images/mountain-6815304_640.jpg') },
  { name: '🎮 Gaming', query: 'gaming', image: require('../assets/images/action-1834465_640.jpg') },
  { name: '🎶 Music', query: 'music', image: require('../assets/images/vinyl-4722544_640.jpg') },
  { name: '🖌️ Art', query: 'art', image: require('../assets/images/watercolor-5049980_640.jpg') },
  { name: '✨ Aesthetic', query: 'aesthetic', image: require('../assets/images/crafting-7117240_640.jpg') },
  { name: '🎭 Anime', query: 'anime', image: require('../assets/images/toy-5433558_640.jpg') },
  { name: '🎤 K-Pop', query: 'kpop', image: require('../assets/images/kpop-singers-9080701_640.jpg') },
  { name: '🧠 Quotes', query: 'quotes', image: require('../assets/images/mug-2586266_640.jpg') },
  { name: '🧃 TikTok', query: 'tiktok', image: require('../assets/images/tiktok-5409103_640.jpg') },
  { name: '🌈 Neon', query: 'neon', image: require('../assets/images/woman-6194370_640.jpg') },
  { name: '🛹 Skateboarding', query: 'skateboarding', image: require('../assets/images/skateboarding-6310245_640.jpg') },
  { name: '🎨 Graffiti', query: 'graffiti', image: require('../assets/images/graffiti-569265_640.jpg') },
  { name: '🏀 Sports', query: 'sports', image: require('../assets/images/action-1834465_640.jpg') },
  { name: '📚 Comics', query: 'comics', image: require('../assets/images/batman-2216148_640.jpg') },
  { name: '🐾 Cartoons', query: 'cartoons', image: require('../assets/images/dancing-dave-minion-510835_640.jpg') },
  { name: '🌅 Sunset', query: 'sunset', image: require('../assets/images/sunset-7762468_640.jpg') },
];

export default function CategoryScreen() {
  const router = useRouter();

  const handleCategoryPress = (query: string) => {
    router.push({ pathname: '/', params: { category: query } });
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f2027" />
      <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
        <Text style={styles.heading}>🎨 Choose a Category</Text>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.name}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => handleCategoryPress(item.query)}
            >
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.overlay}>
                <Text style={styles.cardText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </LinearGradient>
    </View>
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
  card: {
    width: (screenWidth - 48) / 2,
    height: 120,
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  cardText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});
