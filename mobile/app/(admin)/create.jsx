// app/(admin)/create.jsx
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createEvent } from '../../src/services/eventService';

// --- Warna dan Font ---
const PRIMARY_COLOR = '#E9B741';
const TEXT_COLOR = '#1D1E24';
const PLACEHOLDER_COLOR = 'gray';
const WHITE_COLOR = '#FFFFFF';
const CREATE_BUTTON_COLOR_40 = 'rgba(29, 30, 36, 0.4)'; // Opacity 40%

// --- Komponen Input Khusus ---

const DateInput = ({ label, value, onPress }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity onPress={onPress} style={styles.dateInput}>
        <Text style={styles.dateText}>{value}</Text>
        <MaterialCommunityIcons name="calendar-month" size={24} color={TEXT_COLOR} />
      </TouchableOpacity>
    </View>
  );
};

const TimeInput = ({ label, value, onPress }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity onPress={onPress} style={styles.timeInput}>
        <Text style={styles.dateText}>{value}</Text>
        <MaterialCommunityIcons name="chevron-down" size={24} color={TEXT_COLOR} />
      </TouchableOpacity>
    </View>
  );
};

// --- Helper UUID ---
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// --- Komponen Utama ---

export default function CreateEventScreen() {
  // Data Input
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- STATE TANGGAL & WAKTU ---
  // Kita pisahkan Date dan Time untuk Start dan End agar mudah diatur dengan Picker
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());

  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  // State untuk Visibility Picker
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // --- HANDLERS ---

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Handler Start Date
  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);

    // Otomatis set End Date sama dengan Start Date
    setEndDate(currentDate);
  };

  // Handler Start Time
  const onChangeStartTime = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowStartTimePicker(false);
    setStartTime(currentTime);
  };

  // Handler End Date
  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  // Handler End Time
  const onChangeEndTime = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setShowEndTimePicker(false);
    setEndTime(currentTime);
  };

  // Helper Format
  const formatDate = (dateObj) => dayjs(dateObj).format('DD / MM / YYYY');
  const formatTime = (dateObj) => dayjs(dateObj).format('HH:mm');

  const handleCreate = async () => {
    if (!eventName || !location || !description || !image) {
      Alert.alert("Error", "Please fill all fields and select an image.");
      return;
    }

    setLoading(true);

    try {
      // Gabungkan Date dan Time menjadi satu objek Date yang valid
      const startDateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startTime.getHours(), startTime.getMinutes());
      const endDateTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endTime.getHours(), endTime.getMinutes());

      const formData = new FormData();
      formData.append('event_id', generateUUID());
      formData.append('title', eventName);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('start_date', dayjs(startDateTime).format('YYYY-MM-DD HH:mm:ss'));
      formData.append('end_date', dayjs(endDateTime).format('YYYY-MM-DD HH:mm:ss'));

      // Append Image
      const filename = image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('image', { uri: image, name: filename, type });

      await createEvent(formData);

      Alert.alert("Success", "Event created successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);

      // Reset Form
      setEventName('');
      setLocation('');
      setDescription('');
      setImage(null);

    } catch (error) {
      console.log("Error creating event:", error);
      Alert.alert("Error", "Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

        <Text style={styles.headerTitle}>Create New Event</Text>

        {/* Upload Gambar */}
        <TouchableOpacity style={styles.imageUploadArea} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={{ width: '100%', height: '100%', borderRadius: 15 }} />
          ) : (
            <>
              <MaterialCommunityIcons name="camera-plus" size={50} color={TEXT_COLOR} />
              <Text style={styles.uploadText}>Add picture of event</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Input Nama */}
        <Text style={styles.inputLabel}>Name of Event</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Event Name"
          placeholderTextColor={PLACEHOLDER_COLOR}
          value={eventName}
          onChangeText={setEventName}
        />

        {/* Input Lokasi */}
        <Text style={styles.inputLabel}>Location</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Location"
          placeholderTextColor={PLACEHOLDER_COLOR}
          value={location}
          onChangeText={setLocation}
        />

        {/* --- START DATE & TIME --- */}
        <Text style={styles.sectionLabel}>Start of Event</Text>
        <View style={styles.dateTimeRow}>
          <DateInput
            label="Date"
            value={formatDate(startDate)}
            onPress={() => setShowStartDatePicker(true)}
          />
          <TimeInput
            label="Time"
            value={formatTime(startTime)}
            onPress={() => setShowStartTimePicker(true)}
          />
        </View>

        {/* --- END DATE & TIME --- */}
        <Text style={styles.sectionLabel}>End of Event</Text>
        <View style={styles.dateTimeRow}>
          <DateInput
            label="Date"
            value={formatDate(endDate)}
            onPress={() => setShowEndDatePicker(true)}
          />
          <TimeInput
            label="Time"
            value={formatTime(endTime)}
            onPress={() => setShowEndTimePicker(true)}
          />
        </View>

        {/* --- PICKERS (INVISIBLE) --- */}
        {showStartDatePicker && (
          <DateTimePicker value={startDate} mode="date" display="default" onChange={onChangeStartDate} />
        )}
        {showStartTimePicker && (
          <DateTimePicker value={startTime} mode="time" display="default" is24Hour={true} onChange={onChangeStartTime} />
        )}
        {showEndDatePicker && (
          <DateTimePicker value={endDate} mode="date" display="default" onChange={onChangeEndDate} minimumDate={startDate} />
        )}
        {showEndTimePicker && (
          <DateTimePicker value={endTime} mode="time" display="default" is24Hour={true} onChange={onChangeEndTime} />
        )}


        {/* Deskripsi */}
        <Text style={styles.inputLabel}>Description</Text>
        <TextInput
          style={[styles.textInput, styles.descriptionInput]}
          placeholder="Enter event description"
          placeholderTextColor={PLACEHOLDER_COLOR}
          value={description}
          onChangeText={setDescription}
          multiline={true}
          textAlignVertical="top"
        />

        {/* Tombol Create */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={WHITE_COLOR} />
          ) : (
            <Text style={styles.createButtonText}>Create</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 120 }} />

      </ScrollView>
    </SafeAreaView>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentContainer: { paddingHorizontal: 20, paddingTop: 30 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: TEXT_COLOR, marginBottom: 20, fontFamily: 'Alatsi' },
  imageUploadArea: { backgroundColor: '#F0F0F0', borderRadius: 15, height: 150, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#CCC' },
  uploadText: { marginTop: 5, color: TEXT_COLOR, fontFamily: 'Alatsi' },
  inputLabel: { fontSize: 14, fontWeight: 'bold', color: TEXT_COLOR, marginTop: 15, marginBottom: 5, fontFamily: 'Alatsi' },
  sectionLabel: { fontSize: 16, fontWeight: 'bold', color: PRIMARY_COLOR, marginTop: 20, marginBottom: 5, fontFamily: 'Alatsi' },
  textInput: { backgroundColor: '#F0F0F0', borderRadius: 10, paddingHorizontal: 15, height: 50, color: TEXT_COLOR, fontFamily: 'Alatsi' },
  dateTimeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dateInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F0F0F0', borderRadius: 10, paddingHorizontal: 15, height: 50, flex: 1, marginRight: 10 },
  timeInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F0F0F0', borderRadius: 10, paddingHorizontal: 15, height: 50, flex: 1, marginLeft: 10 },
  dateText: { color: TEXT_COLOR, fontFamily: 'Alatsi' },
  inputContainer: { flex: 1 },
  descriptionInput: { height: 150, paddingVertical: 15, backgroundColor: PRIMARY_COLOR, color: TEXT_COLOR, borderRadius: 10, paddingHorizontal: 15 },

  createButton: {
    backgroundColor: CREATE_BUTTON_COLOR_40,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: TEXT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  createButtonText: { fontSize: 18, fontWeight: 'bold', color: WHITE_COLOR, fontFamily: 'Alatsi' },
});