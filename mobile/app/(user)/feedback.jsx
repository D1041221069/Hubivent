import { Feather, Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSearch } from '../../src/contexts/SearchContext';
import { bookmark, getUserEvents, unbookmark, giveFeedback } from '../../src/services/userService';
import { dashboardStyles as styles } from './styles';

export default function FeedbackTab() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { searchQuery } = useSearch();

    // Feedback Modal State
    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);

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
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) && item.attendance
    );

    const renderFeedbackCard = ({ item }) => (
        <View style={styles.cardList}>
            <Image source={{ uri: item.image }} style={styles.cardImageList} />
            <View style={styles.cardContentList}>
                <View style={styles.cardHeaderList}>
                    <Text style={styles.dateText}>{item.date}</Text>
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

                {item.feedback ? (
                    <View style={[styles.btnGrayFull, { backgroundColor: '#4CAF50', flexDirection: 'row', justifyContent: 'center', gap: 5 }]}>
                        <Feather name="check-circle" size={16} color="white" />
                        <Text style={styles.btnTextWhite}>Feedback Given</Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.btnGrayFull}
                        onPress={() => handleGiveFeedback(item)}
                    >
                        <Text style={styles.btnTextWhite}>Give Feedback</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.pageHeader}>
                <Text style={styles.pageTitle}>Feedback</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>Filter</Text>
                    <Feather name="filter" size={18} color="#000" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredEvents}
                keyExtractor={(item) => item.id}
                renderItem={renderFeedbackCard}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

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
                            onPress={ async() => {
                                try {
                                    await giveFeedback(selectedEvent.id, rating, reviewText);
                                    Alert.alert("Success", "Thank you for your feedback!");
                                    setEvents(prevEvents =>
                                        prevEvents.map(ev =>
                                            ev.id === selectedEvent.id
                                                ? { ...ev, feedback: true }
                                                : ev
                                        )
                                    );
                                    setFeedbackModalVisible(false);
                                } catch (error) {
                                    console.log("Error submitting feedback:", error);
                                    Alert.alert("Error", "Failed to submit feedback");
                                }
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
