import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const categories = [
  { id: "1", name: "Nature" },
  { id: "2", name: "Technology" },
  { id: "3", name: "Animals" },
  { id: "4", name: "Architecture" },
  { id: "5", name: "Abstract" },
  { id: "6", name: "Space" },
];

const CategoriesScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate("Wallpaper", { category: item.name })}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  categoryItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#ddd",
    borderRadius: 10,
    alignItems: "center",
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CategoriesScreen;
