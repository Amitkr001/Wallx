import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
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
              height: 85,
              position: 'absolute',
              elevation: 0,
            },
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#ffffff80',
            tabBarBackground: () => (
              <BlurView
                intensity={30}
                tint="dark"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(15, 32, 39, 0.7)',
                }}
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
    backgroundColor: '#00C6FF',
  },
  aiButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00C6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'android' ? 30 : 35,
    elevation: 8,
    shadowColor: '#00C6FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
});
