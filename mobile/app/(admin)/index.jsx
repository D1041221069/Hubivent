import { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    FlatList, 
    ActivityIndicator 
} from "react-native";
import { getAllEvents } from "../../src/services/eventService";
import EventCard from "../../src/components/EventCard";

export default function AdminDashboard() {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await getAllEvents();
            const data = response.data || [];
            setEvents(data);
            setFilteredEvents(data);
            console.log(data);
        } catch (error) {
            console.log("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSearch = (text) => {
        setSearch(text);
        const lower = text.toLowerCase();

        const filtered = events.filter((item) =>
            item.title.toLowerCase().includes(lower)
        );

        setFilteredEvents(filtered);
    };

    return (
        <View style={styles.container}>
            
            <Text style={styles.title}>Dashboard Event</Text>

            {/* Search Bar */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search event..."
                value={search}
                onChangeText={handleSearch}
            />

            {/* Loader */}
            {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

            {/* Event List */}
            {!loading && (
                <FlatList
                    data={filteredEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <EventCard event={item} />}
                    contentContainerStyle={{ paddingTop: 10 }}
                    ListEmptyComponent={
                        <Text style={{ textAlign: "center", marginTop: 20 }}>
                            No events found.
                        </Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 50,
        backgroundColor: "#FFF",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    searchInput: {
        backgroundColor: "#F1F1F1",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        fontSize: 16,
    },
});
