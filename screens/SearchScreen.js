import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";

const UNSPLASH_ACCESS_KEY = "FdYuWIiLfuqafC3kBGEHlysxTUO02U6y0KMmd9h7Be0";

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchImages = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("Wallpaper", { imageUrl: item.urls.full })}>
      <Image source={{ uri: item.urls.small }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search wallpapers..."
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={searchImages} disabled={loading} />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: "48%",
    height: 200,
    margin: "1%",
    borderRadius: 10,
  },
});

export default SearchScreen;