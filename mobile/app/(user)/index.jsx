import { Feather, Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import dayjs from 'dayjs';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, FlatList, Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSearch } from '../../src/contexts/SearchContext';
import { attendance, bookmark, getUserEvents, unbookmark } from '../../src/services/userService';
import { dashboardStyles as styles } from '../../src/styles/dashboardStyles';

export default function HomeTab() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { searchQuery } = useSearch();
    const [permission, requestPermission] = useCameraPermissions();

    // QR Scan State
    const [isScanning, setIsScanning] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);

    // View Mode State
    const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' | 'detail'
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Feedback Modal State
    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    const router = useRouter(); // Replace useNavigation with useRouter for better flow

    useEffect(() => {
        // Clean up any effects if needed
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await getUserEvents() || [];
            setEvents(data);
        } catch (error) {
            console.log("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookmark = async (eventId, isBookmarked) => {
        try {
            // Optimistic update
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === eventId
                        ? { ...event, bookmarked: !event.bookmarked }
                        : event
                )
            );

            if (isBookmarked) {
                await unbookmark(eventId);
            } else {
                await bookmark(eventId);
            }
        } catch (error) {
            console.log("Error toggling bookmark:", error);
            fetchEvents();
        }
    };

    const handleJoin = (event) => {
        if (!permission) {
            return;
        }
        if (!permission.granted) {
            requestPermission();
            return;
        }
        setSelectedEventId(event.id);
        setScanned(false);
        setIsScanning(true);
    };

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        setIsScanning(false);
        try {
            // Verify if scanned ID matches selectedEventId if strictly joining a specific event
            if (selectedEventId && data !== selectedEventId) {
                Alert.alert("Invalid QR", "This QR code does not match the selected event.");
                return;
            }

            const scannedAt = dayjs().format("YYYY-MM-DD HH:mm:ss");
            await attendance(data, scannedAt);

            // Update local state to show "Joined"
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === data
                        ? { ...event, attendance: true }
                        : event
                )
            );

            Alert.alert("Success", "Attendance recorded successfully!");
        } catch (error) {
            console.log("Error recording attendance:", error);
            const errorMessage = error.response?.data?.message || "Failed to record attendance.";
            Alert.alert("Error", errorMessage);
        }
    };

    const handleViewEvent = (item) => {
        router.push({
            pathname: '/(user)/event-detail',
            params: { eventData: JSON.stringify(item) }
        });
    };

    const handleGiveFeedback = (item) => {
        // Usually feedback is for past events, but we'll allow it here as requested
        setSelectedEvent(item);
        setRating(0);
        setReviewText('');
        setFeedbackModalVisible(true);
    };

    useFocusEffect(
        useCallback(() => {
            fetchEvents();
        }, [])
    );

    const filteredEvents = events.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderEventCard = ({ item }) => (
        <View style={styles.cardGrid}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.cardImageGrid} />
                <TouchableOpacity
                    style={styles.bookmarkIconOverlay}
                    onPress={() => handleBookmark(item.id, item.bookmarked)}
                >
                    {item.bookmarked ? (
                        <FontAwesome name="bookmark" size={16} color="black" />
                    ) : (
                        <FontAwesome name="bookmark-o" size={16} color="black" />
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.cardContentGrid}>
                <Text style={styles.dateText}>{dayjs(item.date).format('dddd, D MMMM YYYY')}</Text>
                <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
                <View style={styles.buttonRowGrid}>
                    {item.attendance ? (
                        <View style={[styles.btnGold, { backgroundColor: '#4CAF50', flexDirection: 'row', justifyContent: 'center', gap: 5 }]}>
                            <Feather name="check" size={14} color="white" />
                            <Text style={styles.btnTextWhite}>Joined</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.btnGold}
                            onPress={() => handleJoin(item)}
                        >
                            <Text style={styles.btnTextWhite}>Join</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.btnGoldOutline}
                        onPress={() => handleViewEvent(item)}
                    >
                        <Text style={styles.btnTextGold}>View Event</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );



    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>Events</Text>
                </View>
                <FlatList
                    data={filteredEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={renderEventCard}
                    numColumns={2}
                    contentContainerStyle={[styles.listContainer, { paddingBottom: 120 }]}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>

            {/* Camera Modal */}
            <Modal
                visible={isScanning}
                animationType="slide"
                onRequestClose={() => setIsScanning(false)}
            >
                <View style={{ flex: 1 }}>
                    <CameraView
                        style={{ flex: 1 }}
                        facing="back"
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr"],
                        }}
                    >
                        <View style={{ flex: 1, justifyContent: 'flex-end', padding: 20 }}>
                            <Button title="Cancel" onPress={() => setIsScanning(false)} color="red" />
                        </View>
                    </CameraView>
                </View>
            </Modal>

            {/* Feedback Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={feedbackModalVisible}
                onRequestClose={() => setFeedbackModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Rate Event</Text>
                        <Text style={styles.modalSubtitle}>{selectedEvent?.title}</Text>

                        {/* Star Rating Input */}
                        <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                    <Ionicons
                                        name={star <= rating ? "star" : "star-outline"}
                                        size={32}
                                        color="#F4B400"
                                        style={{ marginHorizontal: 5 }}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Review Text Input */}
                        <TextInput
                            style={styles.reviewInput}
                            placeholder="Write your review here..."
                            multiline
                            numberOfLines={4}
                            value={reviewText}
                            onChangeText={setReviewText}
                        />

                        {/* Actions */}
                        <TouchableOpacity
                            style={[styles.submitButton, { opacity: rating > 0 ? 1 : 0.5 }]}
                            onPress={() => {
                                Alert.alert("Success", "Thank you for your feedback!");
                                setFeedbackModalVisible(false);
                            }}
                            disabled={rating === 0}
                        >
                            <Text style={styles.closeButtonText}>Submit Feedback</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setFeedbackModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}