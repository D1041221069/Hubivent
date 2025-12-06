import { Feather, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/contexts/authContext';
import { SearchProvider, useSearch } from '../../src/contexts/SearchContext';
import { Alert } from 'react-native';

function CustomHeader() {
    const { logout } = useAuth();
    const { searchQuery, setSearchQuery } = useSearch();

    return (
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
            <View style={styles.topHeader}>
                <View style={styles.searchBar}>
                    <Feather name="search" size={20} color="#999" style={{ marginRight: 10 }} />
                    <TextInput
                        placeholder="Search..."
                        placeholderTextColor="#999"
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                {/* 🔥 Alert sebelum logout */}
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            "Konfirmasi",
                            "Apakah Anda ingin keluar?",
                            [
                                { text: "Batal", style: "cancel" },
                                { text: "Keluar", style: "destructive", onPress: logout }
                            ]
                        );
                    }}
                >
                    <Ionicons name="log-out-outline" size={24} color="#F4B400" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default function Layout() {
    return (
        <SearchProvider>
            <Tabs
                screenOptions={{
                    header: () => <CustomHeader />,
                    tabBarStyle: styles.bottomNav,
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: '#000',
                    tabBarInactiveTintColor: '#999',
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="feedback"
                    options={{
                        tabBarIcon: ({ color }) => <Feather name="check-square" size={24} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="saved"
                    options={{
                        tabBarIcon: ({ color }) => <Feather name="bookmark" size={24} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="logout"
                    options={{
                        href: null,
                    }}
                />
            </Tabs>
        </SearchProvider>
    );
}

const styles = StyleSheet.create({
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'space-between',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 45,
        marginRight: 15,
    },
    searchInput: { flex: 1, fontSize: 16, color: '#333' },
    bottomNav: {
        height: 70,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingBottom: 10,
    },
});
