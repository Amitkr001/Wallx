import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f2027" />
      <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
        <Text style={styles.heading}>⚙️ Settings</Text>
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="user" size={20} color="#fff" />
            <Text style={styles.settingText}>Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="bell" size={20} color="#fff" />
            <Text style={styles.settingText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="moon-o" size={20} color="#fff" />
            <Text style={styles.settingText}>Dark Mode</Text>
            <Switch value={true} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="lock" size={20} color="#fff" />
            <Text style={styles.settingText}>Privacy & Security</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="info-circle" size={20} color="#fff" />
            <Text style={styles.settingText}>About</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderTopWidth: 1, borderTopColor: '#ffffff20' }]}>
            <FontAwesome name="sign-out" size={20} color="#ff6b6b" />
            <Text style={[styles.settingText, { color: '#ff6b6b' }]}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  content: {
    paddingBottom: 100,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff10',
    gap: 16,
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
});
