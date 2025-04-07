import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';

type UserData = {
  username?: string;
  email?: string;
  lastLogin?: string;
  createdAt?: string;
};

export default function Settings() {
  const router = useRouter();
  const { user, logout, initializing } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    console.log('🔄 Starting to fetch user data...');
    console.log('👤 Current user:', user);
    
    if (!user || !user.uid) {
      console.log('❌ No user or user.uid found');
      setLoading(false);
      setUserData(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('📡 Fetching from Firestore...');
      const userRef = doc(db, 'users', user.uid);
      console.log('🔍 User reference:', userRef.path);
      
      const docSnap = await getDoc(userRef);
      console.log('📄 Document snapshot:', docSnap.exists() ? 'exists' : 'does not exist');
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('📊 User data:', data);
        setUserData(data);
      } else {
        setError('User profile not found');
        console.warn('❌ User doc does not exist');
      }
    } catch (err) {
      console.error('❌ Error fetching user data:', err);
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect triggered');
    console.log('⚙️ Initializing:', initializing);
    console.log('👤 User state:', user);
    
    if (!initializing) {
      fetchUserData();
    }
  }, [user, initializing]);

  const handleAuthAction = () => {
    if (user) {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', onPress: logout, style: 'destructive' },
        ]
      );
    } else {
      router.push('/login');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f2027" />
      <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
        <Text style={styles.heading}>⚙️ Settings</Text>
        <ScrollView contentContainerStyle={styles.content}>
          {initializing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" size="large" />
              <Text style={styles.loadingText}>Initializing...</Text>
            </View>
          ) : loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" size="large" />
              <Text style={styles.loadingText}>Loading user data...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <FontAwesome name="exclamation-circle" size={24} color="#ff6b6b" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={fetchUserData} style={styles.retryButton}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : userData ? (
            <View style={styles.userCard}>
              <Text style={styles.userText}>👤 {userData.username || 'No username set'}</Text>
              <Text style={styles.userText}>📧 {userData.email || 'No email set'}</Text>
              <Text style={styles.userText}>🕒 Last login: {new Date(userData.lastLogin).toLocaleString()}</Text>
            </View>
          ) : (
            <Text style={styles.noDataText}>No user data found.</Text>
          )}

          <TouchableOpacity onPress={fetchUserData} style={styles.settingItem}>
            <FontAwesome name="refresh" size={20} color="#fff" />
            <Text style={styles.settingText}>Refresh User Data</Text>
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

          <TouchableOpacity
            onPress={handleAuthAction}
            style={[styles.settingItem, { borderTopWidth: 1, borderTopColor: '#ffffff20' }]}
          >
            <FontAwesome
              name={user ? 'sign-out' : 'sign-in'}
              size={20}
              color={user ? '#ff6b6b' : '#00ffcc'}
            />
            <Text style={[styles.settingText, { color: user ? '#ff6b6b' : '#00ffcc' }]}>
              {user ? 'Log Out' : 'Log In'}
            </Text>
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    opacity: 0.8,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff10',
    borderRadius: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#ff6b6b',
    marginTop: 10,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
  },
  retryText: {
    color: '#00ffcc',
  },
  noDataText: {
    color: '#fff',
    marginBottom: 10,
    opacity: 0.8,
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
  userCard: {
    backgroundColor: '#ffffff10',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  userText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
});
