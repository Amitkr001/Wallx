import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            height: 80,
            position: 'absolute',
            justifyContent: 'center', // center the tab bar content vertically
            alignItems: 'center',
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#ccc',
          tabBarBackground: () => (
            <LinearGradient
              colors={['#0f2027', '#203a43', '#2c5364']} // match Home screen
              style={{ flex: 1 }}
            />
          ),
          tabBarItemStyle: {
            marginTop: 10,
            alignItems: 'center',
            justifyContent: 'center',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            paddingBottom: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="home" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="category"
          options={{
            title: 'Category',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="th-large" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="heart" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="cog" size={22} color={color} />
            ),
          }}
        />

        {/* Hidden Screens */}
        <Tabs.Screen name="login" options={{ href: null }} />
        <Tabs.Screen name="wallpaper" options={{ href: null }} />
      </Tabs>
    </View>
  );
}
