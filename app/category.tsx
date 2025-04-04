import { View, Text, StyleSheet } from 'react-native';

export default function CategoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📚 Categories Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
