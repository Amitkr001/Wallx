import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { AuthProvider } from '../context/AuthContext';

export default function Layout() {
  return (
    <AuthProvider>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              height: 80,
              position: 'absolute',
            },
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#ffffff80',
            tabBarBackground: () => (
              <LinearGradient
                colors={['rgba(15, 32, 39, 0.98)', 'rgba(32, 58, 67, 0.98)', 'rgba(44, 83, 100, 0.98)']}
                style={{ flex: 1 }}
              />
            ),
            tabBarItemStyle: {
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 15,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, focused }) => (
                <View style={styles.iconContainer}>
                  <FontAwesome name="home" size={focused ? 26 : 22} color={color} />
                  {focused && <View style={styles.underline} />}
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="category"
            options={{
              title: 'Category',
              tabBarIcon: ({ color, focused }) => (
                <View style={styles.iconContainer}>
                  <FontAwesome name="th-large" size={focused ? 25 : 21} color={color} />
                  {focused && <View style={styles.underline} />}
                </View>
              ),
            }}
          />

          {/* CENTER AI BUTTON */}
          <Tabs.Screen
            name="ai"
            options={{
              title: '',
              tabBarIcon: ({ color, focused }) => (
                <View style={styles.aiButton}>
                  <MaterialCommunityIcons
                    name="robot"
                    size={32}
                    color="#fff"
                  />
                </View>
              ),
              tabBarLabel: () => null,
            }}
          />

          <Tabs.Screen
            name="favorites"
            options={{
              title: 'Favorites',
              tabBarIcon: ({ color, focused }) => (
                <View style={styles.iconContainer}>
                  <FontAwesome name="heart" size={focused ? 26 : 22} color={color} />
                  {focused && <View style={styles.underline} />}
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color, focused }) => (
                <View style={styles.iconContainer}>
                  <FontAwesome name="cog" size={focused ? 25 : 21} color={color} />
                  {focused && <View style={styles.underline} />}
                </View>
              ),
            }}
          />

          {/* Hidden Screens */}
          <Tabs.Screen name="login" options={{ href: null }} />
          <Tabs.Screen name="wallpaper" options={{ href: null }} />
          <Tabs.Screen name="register" options={{ href: null }} />
        </Tabs>
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 6,
  },
  underline: {
    marginTop: 4,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
  aiButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00C6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'android' ? 30 : 35,
    elevation: 6,
    shadowColor: '#00C6FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
});
