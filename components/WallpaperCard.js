import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

const WallpaperCard = ({ imageUrl, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    aspectRatio: 16/9,
  },
});

export default WallpaperCard; 