// app/(admin)/profile.jsx
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
// Ganti library ke Feather
import Feather from 'react-native-vector-icons/Feather';
import { useAuth } from '../../src/contexts/authContext';

// --- Warna & Konstanta ---
const PRIMARY_COLOR = '#E9B741';
const DARK_COLOR = '#1D1E24';
const TEXT_COLOR = '#1D1E24';
const GRAY_BG = '#F4F4F4';
const RED_COLOR = '#FF4D4D';

// URL Gambar Profil Dummy
const PROFILE_IMAGE = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';

// --- Komponen Item Menu ---
const MenuItem = ({ icon, label, isDestructive, hasSwitch, switchValue, onSwitchChange, onPress }) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    disabled={hasSwitch}
    activeOpacity={0.7}
  >
    <View style={styles.menuItemLeft}>
      <View style={[styles.iconContainer, isDestructive && styles.iconContainerDestructive]}>
        {/* Menggunakan Feather Icon */}
        <Feather
          name={icon}
          size={22}
          color={isDestructive ? RED_COLOR : DARK_COLOR}
        />
      </View>
      <Text style={[styles.menuItemText, isDestructive && styles.destructiveText]}>{label}</Text>
    </View>

    {hasSwitch ? (
      <Switch
        trackColor={{ false: "#767577", true: PRIMARY_COLOR }}
        thumbColor={switchValue ? "#fff" : "#f4f3f4"}
        onValueChange={onSwitchChange}
        value={switchValue}
      />
    ) : (
      <Feather name="chevron-right" size={24} color="#CCC" />
    )}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const [isNotificationOn, setNotificationOn] = useState(true);
  const { logout, user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: () => logout() }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* 1. Header Profil */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: PROFILE_IMAGE }} style={styles.profileImage} />
          <TouchableOpacity style={styles.editIconBadge}>
            {/* Icon Edit menggunakan Feather */}
            <Feather name="edit-2" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user?.name || 'Admin'}</Text>
        <Text style={styles.userRole}>{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Administrator'}</Text>
      </View>

      {/* 2. Statistik Admin */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1.2k</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {/* 3. Menu Settings */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        {/* Icon mapping ke Feather */}
        <MenuItem
          icon="user"
          label="Edit Profile"
          onPress={() => console.log('Edit Profile')}
        />
        <MenuItem
          icon="lock"
          label="Change Password"
          onPress={() => console.log('Change Pass')}
        />
        <MenuItem
          icon="bell"
          label="Notifications"
          hasSwitch={true}
          switchValue={isNotificationOn}
          onSwitchChange={setNotificationOn}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>General</Text>

        <MenuItem
          icon="shield"
          label="Privacy Policy"
          onPress={() => console.log('Privacy')}
        />
        <MenuItem
          icon="help-circle"
          label="Help Center"
          onPress={() => console.log('Help')}
        />
      </View>

      {/* 4. Tombol Logout */}
      <View style={[styles.sectionContainer, { marginBottom: 100 }]}>
        <MenuItem
          icon="log-out"
          label="Log Out"
          isDestructive={true}
          onPress={handleLogout}
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
  },
  profileImageContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: PRIMARY_COLOR,
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: DARK_COLOR,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TEXT_COLOR,
    fontFamily: 'Alatsi',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 14,
    color: 'gray',
    fontFamily: 'Alatsi',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    fontFamily: 'Alatsi',
  },
  statLabel: {
    fontSize: 12,
    color: 'gray',
    marginTop: 2,
    fontFamily: 'Alatsi',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  sectionContainer: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT_COLOR,
    marginBottom: 15,
    fontFamily: 'Alatsi',
    opacity: 0.8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: GRAY_BG,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 35,
    height: 35,
    backgroundColor: '#FFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconContainerDestructive: {
    backgroundColor: '#FFE5E5',
  },
  menuItemText: {
    fontSize: 16,
    color: TEXT_COLOR,
    fontFamily: 'Alatsi',
  },
  destructiveText: {
    color: RED_COLOR,
    fontWeight: 'bold',
  },
});