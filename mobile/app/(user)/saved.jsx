import { Feather, Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import dayjs from 'dayjs';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, FlatList, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSearch } from '../../src/contexts/SearchContext';
import { attendance, bookmark, getUserEvents, unbookmark } from '../../src/services/userService';
import { dashboardStyles as styles } from './styles';

export default function SavedTab() {
    const navigation = useNavigation();
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

    useEffect(() => {
        if (viewMode === 'detail') {
            navigation.setOptions({
                headerShown: false,
                tabBarStyle: { display: 'none' }
            });
        } else {
            navigation.setOptions({
                headerShown: true,
                tabBarStyle: {
                    height: 70,
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#eee',
                    paddingBottom: 10,
                }
            });
        }
    }, [viewMode, navigation]);

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

        if (selectedEventId && data !== selectedEventId) {
            Alert.alert("Invalid QR", "This QR code does not match the selected event.");
            return;
        }

        try {
            const scannedAt = dayjs().format("YYYY-MM-DD HH:mm:ss");
            await attendance(data, scannedAt);

            // Update local state
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
        setSelectedEvent(item);
        setViewMode('detail');
    };

    const handleBackToDashboard = () => {
        setViewMode('dashboard');
        setSelectedEvent(null);
    };

    const handleGiveFeedback = (item) => {
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
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) && item.bookmarked
    );

    const renderSavedCard = ({ item }) => (
        <View style={styles.cardList}>
            <Image source={{ uri: item.image }} style={styles.cardImageList} />
            <View style={styles.cardContentList}>
                <View style={styles.cardHeaderList}>
                    <Text style={styles.dateText}>{dayjs(item.date).format('dddd, D MMMM YYYY')}</Text>
                    <TouchableOpacity onPress={() => handleBookmark(item.id, item.bookmarked)}>
                        {item.bookmarked ? (
                            <FontAwesome name="bookmark" size={16} color="black" />
                        ) : (
                            <FontAwesome name="bookmark-o" size={16} color="black" />
                        )}
                    </TouchableOpacity>
                </View>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.descText} numberOfLines={2}>{item.desc}</Text>
                <View style={styles.buttonRowList}>
                    {item.attendance ? (
                        <View style={[styles.btnGraySmall, { marginRight: 8, flex: 1, backgroundColor: '#4CAF50', flexDirection: 'row', gap: 5, justifyContent: 'center' }]}>
                            <Feather name="check" size={14} color="white" />
                            <Text style={styles.btnTextWhite}>Joined</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[styles.btnGraySmall, { marginRight: 8, flex: 1 }]}
                            onPress={() => handleJoin(item)}
                        >
                            <Text style={styles.btnTextWhite}>Join</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.btnGoldSmall, { flex: 1 }]}
                        onPress={() => handleViewEvent(item)}
                    >
                        <Text style={styles.btnTextWhite}>View Event</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderEventDetail = () => {
        if (!selectedEvent) return null;

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Header Image */}
                    <View style={styles.detailImageContainer}>
                        <Image source={{ uri: selectedEvent.image }} style={styles.detailImage} />
                        <TouchableOpacity style={styles.backButton} onPress={handleBackToDashboard}>
                            <Feather name="arrow-left" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View style={styles.detailContent}>
                        <Text style={styles.detailDate}>{dayjs(selectedEvent.date).format('dddd, D MMMM YYYY')}</Text>
                        <Text style={styles.detailTitle}>{selectedEvent.title}</Text>

                        <View style={styles.detailMetaRow}>
                            <View style={styles.detailMetaItem}>
                                <Feather name="map-pin" size={16} color="#F4B400" />
                                <Text style={styles.detailMetaText}>{selectedEvent.location || 'Kampus Untan'}</Text>
                            </View>
                            <View style={styles.detailMetaItem}>
                                <Feather name="user" size={16} color="#F4B400" />
                                <Text style={styles.detailMetaText}>{selectedEvent.time || 'Event Time'}</Text>
                            </View>
                        </View>

                        <Text style={styles.sectionHeading}>Description</Text>
                        <Text style={styles.loremText}>
                            {selectedEvent.desc || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
                        </Text>
                    </View>
                </ScrollView>

                {/* Floating Action Button for Detail */}
                <View style={styles.detailFooter}>
                    {selectedEvent.attendance ? (
                        <View style={[styles.btnJoinLarge, { backgroundColor: '#4CAF50', flexDirection: 'row', gap: 10, justifyContent: 'center' }]}>
                            <Feather name="check" size={20} color="white" />
                            <Text style={styles.btnTextWhiteLarge}>Joined</Text>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.btnJoinLarge} onPress={() => handleJoin(selectedEvent)}>
                            <Text style={styles.btnTextWhiteLarge}>Join Now</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    const renderDashboard = () => (
        <View style={{ flex: 1 }}>
            <View style={styles.pageHeader}>
                <Text style={styles.pageTitle}>Saved Events</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>Filter</Text>
                    <Feather name="filter" size={18} color="#000" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredEvents}
                keyExtractor={(item) => item.id}
                renderItem={renderSavedCard}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {viewMode === 'dashboard' ? renderDashboard() : renderEventDetail()}

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
