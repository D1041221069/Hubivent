import { Feather } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EventDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [event, setEvent] = useState(null);
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        if (params.eventData) {
            try {
                const data = JSON.parse(params.eventData);
                setEvent(data);
            } catch (e) {
                console.error("Failed to parse event data", e);
            }
        }
    }, [params.eventData]);

    const handleJoin = async () => {
        // Here we could implement the QR scan logic or direct join if already scanned?
        // The user's original logic involved scanning QR to join.
        // Assuming "Join" button here might trigger scanner or check location/time.
        // For now, I'll alert as placeholder or if logic was to open scanner.
        // If the user wants the scanner, they might need to go back or open camera here.
        // Let's assume standard join or redirect to scanner.
        router.back(); // Or handle join logic
        Alert.alert("Info", "Find the QR code at the venue to join!");
    };

    if (!event) return null;

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header Image */}
                <View style={styles.detailImageContainer}>
                    <Image source={{ uri: event.image }} style={styles.detailImage} />
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Feather name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.detailContent}>
                    <Text style={styles.detailDate}>{dayjs(event.date).format('dddd, D MMMM YYYY')}</Text>
                    <Text style={styles.detailTitle}>{event.title}</Text>

                    <View style={styles.detailMetaRow}>
                        <View style={styles.detailMetaItem}>
                            <Feather name="map-pin" size={16} color="#F4B400" />
                            <Text style={styles.detailMetaText}>{event.location || 'Kampus Untan'}</Text>
                        </View>
                        <View style={styles.detailMetaItem}>
                            <Feather name="clock" size={16} color="#F4B400" />
                            <Text style={styles.detailMetaText}>{event.time || 'Event Time'}</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionHeading}>Description</Text>
                    <Text style={styles.loremText}>
                        {event.desc || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
                    </Text>
                </View>
            </ScrollView>

            {/* Floating Action Button for Detail - SAFE FROM BOTTOM NAV */}
            <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'white' }}>
                <View style={styles.detailFooter}>
                    {event.attendance ? (
                        <View style={[styles.btnJoinLarge, { backgroundColor: '#4CAF50', flexDirection: 'row', gap: 10, justifyContent: 'center' }]}>
                            <Feather name="check" size={20} color="white" />
                            <Text style={styles.btnTextWhiteLarge}>Joined</Text>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.btnJoinLarge} onPress={handleJoin}>
                            <Text style={styles.btnTextWhiteLarge}>Join Now</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    detailImageContainer: {
        height: 300,
        position: 'relative',
    },
    detailImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 8,
    },
    detailContent: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
    },
    detailDate: {
        fontSize: 14,
        color: '#F4B400',
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: 'Alatsi',
    },
    detailTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        fontFamily: 'Alatsi',
    },
    detailMetaRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    detailMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    detailMetaText: {
        marginLeft: 5,
        color: '#666',
        fontSize: 14,
        fontFamily: 'Alatsi',
    },
    sectionHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        fontFamily: 'Alatsi',
    },
    loremText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#666',
        textAlign: 'justify',
        fontFamily: 'Alatsi',
    },
    detailFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        // backgroundColor: '#fff', // Handled by SafeAreaView container
    },
    btnJoinLarge: {
        backgroundColor: '#F4B400',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#F4B400',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    btnTextWhiteLarge: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Alatsi',
    },
});
