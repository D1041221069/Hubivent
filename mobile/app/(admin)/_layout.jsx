import { Tabs } from "expo-router";
import { AuthProvider } from "../../src/contexts/authContext";
import { Ionicons } from "@expo/vector-icons";

export default function AdminLayout() {
    return (
        <AuthProvider>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: "#1E88E5",
                    tabBarInactiveTintColor: "#999",
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Dashboard",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="grid-outline" size={size} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="logout"
                    options={{
                        title: "Logout",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="log-out-outline" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </AuthProvider>
    );
}