import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Dimensions, StatusBar, Platform, Image, FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  { 
    name: 'Abstract', 
    color: '#007cf0', 
    icon: 'color-palette',
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500'
  },
  { 
    name: 'Aesthetic', 
    color: '#7928ca', 
    icon: 'sparkles',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500'
  },
  { 
    name: 'Nature', 
    color: '#0f9d58', 
    icon: 'leaf',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500'
  },
  { 
    name: 'Space', 
    color: '#8e24aa', 
    icon: 'planet',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500'
  },
  { 
    name: 'Animals', 
    color: '#f57c00', 
    icon: 'paw',
    image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=500'
  },
  { 
    name: 'Architecture', 
    color: '#5c6bc0', 
    icon: 'business',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500'
  },
  { 
    name: 'Food', 
    color: '#e53935', 
    icon: 'restaurant',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500'
  },
  { 
    name: 'Travel', 
    color: '#43a047', 
    icon: 'airplane',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500'
  },
  { 
    name: 'Art', 
    color: '#d81b60', 
    icon: 'brush',
    image: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=500'
  },
  { 
    name: 'Technology', 
    color: '#546e7a', 
    icon: 'laptop',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500'
  },
  { 
    name: 'Sports', 
    color: '#039be5', 
    icon: 'basketball',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500'
  },
  { 
    name: 'Music', 
    color: '#7b1fa2', 
    icon: 'musical-notes',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500'
  },
  { 
    name: 'Minimal', 
    color: '#455a64', 
    icon: 'grid',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500'
  },
  { 
    name: 'Gaming', 
    color: '#e91e63', 
    icon: 'game-controller',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500'
  },
  { 
    name: 'Fashion', 
    color: '#9c27b0', 
    icon: 'shirt',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500'
  },
  { 
    name: 'Cars', 
    color: '#f44336', 
    icon: 'car',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500'
  },
  { 
    name: 'Beach', 
    color: '#00bcd4', 
    icon: 'water',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500'
  },
  { 
    name: 'Mountains', 
    color: '#4caf50', 
    icon: 'mountain',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500'
  },
  { 
    name: 'City', 
    color: '#607d8b', 
    icon: 'business',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500'
  },
  { 
    name: 'Flowers', 
    color: '#ff9800', 
    icon: 'flower',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500'
  },
  { 
    name: 'Sunset', 
    color: '#ff5722', 
    icon: 'sunny',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500'
  },
  { 
    name: 'Ocean', 
    color: '#2196f3', 
    icon: 'water',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500'
  },
  { 
    name: 'Forest', 
    color: '#4caf50', 
    icon: 'leaf',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500'
  },
  { 
    name: 'Night', 
    color: '#673ab7', 
    icon: 'moon',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500'
  },
  { 
    name: 'Winter', 
    color: '#03a9f4', 
    icon: 'snow',
    image: 'https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=500'
  },
  { 
    name: 'Summer', 
    color: '#ff9800', 
    icon: 'sunny',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500'
  }
];

const screenWidth = Dimensions.get('window').width;
const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 20;

const Category = () => {
  const router = useRouter();

  const handleCategoryPress = (category: string) => {
    router.push({ pathname: '/', params: { category } });
  };

  return (
    <LinearGradient
      colors={['#0A192F', '#112240', '#1D3461']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#64FFDA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Categories Grid */}
      <FlatList
        data={CATEGORIES}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(item.name)}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.categoryImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.categoryGradient}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as any} size={24} color="#fff" />
              </View>
              <Text style={styles.categoryName}>{item.name}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.name}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: statusBarHeight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E6F1FF',
  },
  gridContainer: {
    padding: 16,
  },
  categoryCard: {
    width: (screenWidth - 48) / 2,
    height: 200,
    borderRadius: 20,
    marginBottom: 16,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
});

export default Category;
