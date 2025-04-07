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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';

export default function Settings() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState<{ username?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    if (!user || !user.uid) {
      setLoading(false); // Avoid infinite loading
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.warn('User doc does not exist');
        setUserData(null);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]); // <- make sure this triggers when user changes

  const handleAuthAction = () => {
    if (user) {
      logout();
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
          {loading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : userData ? (
            <View style={styles.userCard}>
              <Text style={styles.userText}>👤 {userData.username}</Text>
              <Text style={styles.userText}>📧 {userData.email}</Text>
            </View>
          ) : (
            <Text style={{ color: '#fff', marginBottom: 10 }}>No user data found.</Text>
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
