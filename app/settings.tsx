import { View, Text, StyleSheet, Switch, TextInput, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const systemTheme = useColorScheme();

  const [darkMode, setDarkMode] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [email, setEmail] = useState('Loading...');
  const [imageQuality, setImageQuality] = useState('High');
  const [displayMode, setDisplayMode] = useState('Grid');

  const isDark = darkMode || systemTheme === 'dark';
  const bgColor = isDark ? '#111' : '#fff';
  const textColor = isDark ? '#fff' : '#000';

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) setEmail(data.user.email);

      const savedDarkMode = await AsyncStorage.getItem('darkMode');
      const savedImageQuality = await AsyncStorage.getItem('imageQuality');
      const savedDisplayMode = await AsyncStorage.getItem('displayMode');
      const savedApiKey = await AsyncStorage.getItem('apiKey');

      if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode));
      if (savedImageQuality) setImageQuality(savedImageQuality);
      if (savedDisplayMode) setDisplayMode(savedDisplayMode);
      if (savedApiKey) setApiKey(savedApiKey);
    };

    init();
  }, []);

  const toggleDarkMode = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    await AsyncStorage.setItem('darkMode', JSON.stringify(newValue));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const handleClearCache = async () => {
    await AsyncStorage.clear();
    Alert.alert('✅ Cache Cleared!');
  };

  const handleImageQualityChange = async (value: string) => {
    setImageQuality(value);
    await AsyncStorage.setItem('imageQuality', value);
  };

  const handleDisplayModeChange = async (value: string) => {
    setDisplayMode(value);
    await AsyncStorage.setItem('displayMode', value);
  };

  const handleApiKeyChange = async (value: string) => {
    setApiKey(value);
    await AsyncStorage.setItem('apiKey', value);
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={[styles.title, { color: textColor }]}>⚙️ Settings</Text>

      <View style={styles.section}>
        <Text style={[styles.label, { color: textColor }]}>👤 Logged in as:</Text>
        <Text style={[styles.email, { color: textColor }]}>{email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: textColor }]}>🌗 Dark Mode</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: textColor }]}>🏞️ Image Quality</Text>
        <Picker
          selectedValue={imageQuality}
          onValueChange={handleImageQualityChange}
          style={{ color: textColor }}
          dropdownIconColor={textColor}
        >
          <Picker.Item label="Low" value="Low" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="High" value="High" />
        </Picker>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: textColor }]}>🎨 Display Mode</Text>
        <Picker
          selectedValue={displayMode}
          onValueChange={handleDisplayModeChange}
          style={{ color: textColor }}
          dropdownIconColor={textColor}
        >
          <Picker.Item label="Grid" value="Grid" />
          <Picker.Item label="List" value="List" />
        </Picker>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: textColor }]}>🔑 API Key (optional)</Text>
        <TextInput
          placeholder="Enter your API key..."
          placeholderTextColor={isDark ? '#aaa' : '#666'}
          style={[styles.input, { color: textColor, borderColor: isDark ? '#555' : '#ccc' }]}
          value={apiKey}
          onChangeText={handleApiKeyChange}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleClearCache}>
        <Text style={styles.buttonText}>🗑️ Clear Cache</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>🚪 Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.version, { color: textColor }]}>Wallx v1.0.0</Text>
        <Text style={[styles.footerText, { color: isDark ? '#aaa' : '#888' }]}>Made with ❤️ using Expo & Supabase</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  section: {
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: { fontSize: 16, marginBottom: 5 },
  email: { fontSize: 14 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  footer: { marginTop: 30, alignItems: 'center' },
  version: { fontSize: 14, fontWeight: 'bold' },
  footerText: { fontSize: 12 },
});
