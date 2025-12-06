// app/(admin)/index.jsx
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EventItem from '../../src/components/EventItem';
import { deleteEvent, getAllEvents } from '../../src/services/eventService';

// Warna utama
const PRIMARY_COLOR = '#E9B741';
const TEXT_COLOR = '#1D1E24';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // QR Modal State
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents() || [];
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.log("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleDelete = (eventId) => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteEvent(eventId);
              Alert.alert("Success", "Event deleted successfully");
              fetchEvents();
            } catch (error) {
              console.log("Error deleting event:", error);
              Alert.alert("Error", "Failed to delete event: " + (error.message || "Unknown error"));
            }
          }
        }
      ]
    );
  };

  const handleEdit = (event) => {
    router.push({
      pathname: '/(admin)/edit',
      params: {
        id: event.id,
        originalData: JSON.stringify(event.originalData)
      }
    });
  };

  const handleShowQR = (event) => {
    setSelectedEvent(event);
    setQrModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        {/* Kotak Pencarian */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={24} color={TEXT_COLOR} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor={'gray'}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        {/* Ikon Filter */}
        <MaterialCommunityIcons name="filter-variant" size={24} color={TEXT_COLOR} />
      </View>

      <Text style={styles.listTitle}>List Event</Text>

      {/* Daftar Event */}
      <FlatList
        data={filteredEvents}
        renderItem={({ item }) => (
          <EventItem
            event={item}
            onDelete={handleDelete}
            onShowQR={handleShowQR}
            onEdit={handleEdit}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={fetchEvents}
      />

      {/* QR Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={qrModalVisible}
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>QR Code</Text>
            <Text style={styles.modalSubtitle}>{selectedEvent?.title}</Text>
            <View style={styles.qrPlaceholder}>
              <Image
                source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedEvent?.id}` }}
                style={styles.qrImage}
              />
            </View>
            <Text style={styles.scanText}>Event ID: {selectedEvent?.id}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setQrModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 15,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    height: 45,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: TEXT_COLOR,
    fontFamily: 'Alatsi',
  },
  listTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: TEXT_COLOR,
    marginHorizontal: 15,
    marginBottom: 10,
    fontFamily: 'Alatsi',
  },
  listContent: {
    paddingBottom: 80,
  },
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  qrPlaceholder: { marginBottom: 20, padding: 10, backgroundColor: '#fff', borderRadius: 10 },
  qrImage: { width: 180, height: 180 },
  scanText: { fontSize: 12, color: '#888', marginBottom: 20 },
  closeButton: { backgroundColor: '#E9B741', borderRadius: 25, paddingVertical: 10, paddingHorizontal: 30, elevation: 2 },
  closeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default HomeScreen;