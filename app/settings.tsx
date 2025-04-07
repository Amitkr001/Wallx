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
  TextInput,
  Modal,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { deleteUser } from 'firebase/auth';

type UserData = {
  username?: string;
  email?: string;
  lastLogin?: string;
  createdAt?: string;
  notifications?: boolean;
  darkMode?: boolean;
  language?: string;
  privacy?: {
    showEmail?: boolean;
    showLastLogin?: boolean;
    showCreatedAt?: boolean;
  };
  appPreferences?: {
    autoPlay?: boolean;
    dataSaver?: boolean;
    cacheSize?: number;
  };
};

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
];

export default function Settings() {
  const router = useRouter();
  const { user, logout, initializing } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAppPreferencesModal, setShowAppPreferencesModal] = useState(false);

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
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as UserData;
        console.log('📊 User data:', data);
        setUserData(data);
        setEditUsername(data.username || '');
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

  const handleUpdateProfile = async () => {
    if (!user || !user.uid) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        username: editUsername,
        updatedAt: new Date().toISOString(),
      });
      
      setUserData(prev => prev ? { ...prev, username: editUsername } : null);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    if (!user || !user.uid) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        notifications: value,
      });
      
      setUserData(prev => prev ? { ...prev, notifications: value } : null);
    } catch (error) {
      console.error('Error updating notifications:', error);
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  const handleToggleDarkMode = async (value: boolean) => {
    if (!user || !user.uid) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        darkMode: value,
      });
      
      setUserData(prev => prev ? { ...prev, darkMode: value } : null);
    } catch (error) {
      console.error('Error updating theme:', error);
      Alert.alert('Error', 'Failed to update theme settings');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      // Delete user document from Firestore
      const userRef = doc(db, 'users', user.uid);
      await deleteDoc(userRef);
      
      // Delete user from Firebase Auth
      await deleteUser(user);
      
      Alert.alert('Success', 'Account deleted successfully');
      router.replace('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'Failed to delete account');
    }
  };

  const handleLanguageChange = async (languageCode: string) => {
    if (!user || !user.uid) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        language: languageCode,
      });
      
      setUserData(prev => prev ? { ...prev, language: languageCode } : null);
      setShowLanguageModal(false);
      Alert.alert('Success', 'Language preference updated!');
    } catch (error) {
      console.error('Error updating language:', error);
      Alert.alert('Error', 'Failed to update language preference');
    }
  };

  const handlePrivacyChange = async (key: keyof UserData['privacy'], value: boolean) => {
    if (!user || !user.uid) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        [`privacy.${key}`]: value,
      });
      
      setUserData(prev => prev ? {
        ...prev,
        privacy: { ...prev.privacy, [key]: value }
      } : null);
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      Alert.alert('Error', 'Failed to update privacy settings');
    }
  };

  const handleAppPreferenceChange = async (key: keyof UserData['appPreferences'], value: boolean | number) => {
    if (!user || !user.uid) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        [`appPreferences.${key}`]: value,
      });
      
      setUserData(prev => prev ? {
        ...prev,
        appPreferences: { ...prev.appPreferences, [key]: value }
      } : null);
    } catch (error) {
      console.error('Error updating app preferences:', error);
      Alert.alert('Error', 'Failed to update app preferences');
    }
  };

  const handleClearCache = async () => {
    try {
      // Implement cache clearing logic here
      Alert.alert('Success', 'Cache cleared successfully!');
    } catch (error) {
      console.error('Error clearing cache:', error);
      Alert.alert('Error', 'Failed to clear cache');
    }
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@wallx.com');
  };

  const handleViewTerms = () => {
    Linking.openURL('https://wallx.com/terms');
  };

  const handleViewPrivacyPolicy = () => {
    Linking.openURL('https://wallx.com/privacy');
  };

  useEffect(() => {
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
              {isEditing ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.input}
                    value={editUsername}
                    onChangeText={setEditUsername}
                    placeholder="Enter username"
                    placeholderTextColor="#ffffff80"
                  />
                  <View style={styles.editButtons}>
                    <TouchableOpacity
                      style={[styles.editButton, styles.cancelButton]}
                      onPress={() => setIsEditing(false)}
                    >
                      <Text style={styles.editButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.editButton, styles.saveButton]}
                      onPress={handleUpdateProfile}
                    >
                      <Text style={styles.editButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  <Text style={styles.userText}>👤 {userData.username || 'No username set'}</Text>
                  <Text style={styles.userText}>📧 {userData.email || 'No email set'}</Text>
                  <Text style={styles.userText}>🕒 Last login: {new Date(userData.lastLogin || '').toLocaleString()}</Text>
                  <TouchableOpacity
                    style={styles.editProfileButton}
                    onPress={() => setIsEditing(true)}
                  >
                    <FontAwesome name="edit" size={16} color="#00ffcc" />
                    <Text style={styles.editProfileText}>Edit Profile</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            <Text style={styles.noDataText}>No user data found.</Text>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setShowLanguageModal(true)}
            >
              <FontAwesome name="language" size={20} color="#fff" />
              <Text style={styles.settingText}>Language</Text>
              <Text style={styles.settingValue}>
                {languages.find(lang => lang.code === userData?.language)?.name || 'English'}
              </Text>
              <FontAwesome name="chevron-right" size={16} color="#ffffff80" />
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <FontAwesome name="bell" size={20} color="#fff" />
              <Text style={styles.settingText}>Notifications</Text>
              <Switch
                value={userData?.notifications ?? false}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: '#767577', true: '#00ffcc' }}
                thumbColor={userData?.notifications ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <FontAwesome name="moon-o" size={20} color="#fff" />
              <Text style={styles.settingText}>Dark Mode</Text>
              <Switch
                value={userData?.darkMode ?? true}
                onValueChange={handleToggleDarkMode}
                trackColor={{ false: '#767577', true: '#00ffcc' }}
                thumbColor={userData?.darkMode ? '#fff' : '#f4f3f4'}
              />
            </View>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setShowPrivacyModal(true)}
            >
              <FontAwesome name="lock" size={20} color="#fff" />
              <Text style={styles.settingText}>Privacy Settings</Text>
              <FontAwesome name="chevron-right" size={16} color="#ffffff80" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setShowAppPreferencesModal(true)}
            >
              <FontAwesome name="cog" size={20} color="#fff" />
              <Text style={styles.settingText}>App Preferences</Text>
              <FontAwesome name="chevron-right" size={16} color="#ffffff80" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Storage</Text>
            
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleClearCache}
            >
              <FontAwesome name="trash" size={20} color="#fff" />
              <Text style={styles.settingText}>Clear Cache</Text>
              <Text style={styles.settingValue}>
                {userData?.appPreferences?.cacheSize ? `${userData.appPreferences.cacheSize} MB` : '0 MB'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleContactSupport}
            >
              <FontAwesome name="envelope" size={20} color="#fff" />
              <Text style={styles.settingText}>Contact Support</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleViewTerms}
            >
              <FontAwesome name="file-text" size={20} color="#fff" />
              <Text style={styles.settingText}>Terms of Service</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleViewPrivacyPolicy}
            >
              <FontAwesome name="shield" size={20} color="#fff" />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
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

            {user && (
              <TouchableOpacity
                style={[styles.settingItem, { borderTopWidth: 1, borderTopColor: '#ffffff20' }]}
                onPress={() => setShowDeleteModal(true)}
              >
                <FontAwesome name="trash" size={20} color="#ff6b6b" />
                <Text style={[styles.settingText, { color: '#ff6b6b' }]}>
                  Delete Account
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  userData?.language === lang.code && styles.selectedLanguage
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <Text style={styles.languageText}>{lang.name}</Text>
                {userData?.language === lang.code && (
                  <FontAwesome name="check" size={16} color="#00ffcc" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Privacy Settings Modal */}
      <Modal
        visible={showPrivacyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Privacy Settings</Text>
            <View style={styles.privacyOption}>
              <Text style={styles.privacyText}>Show Email</Text>
              <Switch
                value={userData?.privacy?.showEmail ?? false}
                onValueChange={(value) => handlePrivacyChange('showEmail', value)}
                trackColor={{ false: '#767577', true: '#00ffcc' }}
              />
            </View>
            <View style={styles.privacyOption}>
              <Text style={styles.privacyText}>Show Last Login</Text>
              <Switch
                value={userData?.privacy?.showLastLogin ?? false}
                onValueChange={(value) => handlePrivacyChange('showLastLogin', value)}
                trackColor={{ false: '#767577', true: '#00ffcc' }}
              />
            </View>
            <View style={styles.privacyOption}>
              <Text style={styles.privacyText}>Show Account Creation Date</Text>
              <Switch
                value={userData?.privacy?.showCreatedAt ?? false}
                onValueChange={(value) => handlePrivacyChange('showCreatedAt', value)}
                trackColor={{ false: '#767577', true: '#00ffcc' }}
              />
            </View>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowPrivacyModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* App Preferences Modal */}
      <Modal
        visible={showAppPreferencesModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAppPreferencesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>App Preferences</Text>
            <View style={styles.privacyOption}>
              <Text style={styles.privacyText}>Auto-play Videos</Text>
              <Switch
                value={userData?.appPreferences?.autoPlay ?? false}
                onValueChange={(value) => handleAppPreferenceChange('autoPlay', value)}
                trackColor={{ false: '#767577', true: '#00ffcc' }}
              />
            </View>
            <View style={styles.privacyOption}>
              <Text style={styles.privacyText}>Data Saver Mode</Text>
              <Switch
                value={userData?.appPreferences?.dataSaver ?? false}
                onValueChange={(value) => handleAppPreferenceChange('dataSaver', value)}
                trackColor={{ false: '#767577', true: '#00ffcc' }}
              />
            </View>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowAppPreferencesModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  editContainer: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#ffffff20',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  editButton: {
    padding: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ffffff20',
  },
  saveButton: {
    backgroundColor: '#00ffcc',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  editProfileText: {
    color: '#00ffcc',
    fontSize: 14,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
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
  settingValue: {
    color: '#ffffff80',
    marginRight: 8,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff20',
  },
  selectedLanguage: {
    backgroundColor: '#ffffff10',
  },
  languageText: {
    color: '#fff',
    fontSize: 16,
  },
  privacyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff20',
  },
  privacyText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a2a32',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalText: {
    color: '#fff',
    marginBottom: 20,
    opacity: 0.8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
