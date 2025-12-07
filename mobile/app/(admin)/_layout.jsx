// app/(admin)/_layout.jsx
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';

// Warna utama
const PRIMARY_COLOR = '#E9B741';
const BACKGROUND_COLOR = '#1D1E24';

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: BACKGROUND_COLOR, // Warna ikon aktif
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
        headerShown: false, // Sembunyikan header default
        tabBarStyle: styles.tabBar,
      }}
    >
      {/* Tombol Kiri: Home/Beranda */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Tombol Tengah: Create Event */}
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus-square" size={size} color={color} />
          ),
        }}
      />

      {/* Tombol Kanan: Profile Admin */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} /> // Menggunakan 'settings' seperti saran sebelumnya
          ),
        }}
      />
      <Tabs.Screen
        name="edit"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: PRIMARY_COLOR,
    borderTopWidth: 0,
    height: useSafeAreaInsets.bottom,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  }
});