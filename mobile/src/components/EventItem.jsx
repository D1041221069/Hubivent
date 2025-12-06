// components/EventItem.jsx
import dayjs from 'dayjs';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// Warna utama
const PRIMARY_COLOR = '#E9B741';
const BACKGROUND_COLOR = '#1D1E24';

const EventItem = ({ event, onDelete, onShowQR, onEdit }) => {
  return (
    <View style={styles.card}>
      {/* Ganti source dengan URL gambar yang sebenarnya atau path lokal */}
      <Image source={{ uri: event.image }} style={styles.image} />

      <View style={styles.detailsContainer}>
        <Text style={styles.date}>{dayjs(event.date).format('dddd, D MMMM YYYY')}</Text>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>
          {event.description
            ?.split('.')
            .filter(sentence => sentence.trim() !== '')
            .slice(0, 2)
            .join('. ') + '.'}
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => onEdit(event)}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => onDelete(event.id)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.qrButton} onPress={() => onShowQR(event)}>
            {/* Ikon QR */}
            <MaterialCommunityIcons name="qrcode" size={20} color={BACKGROUND_COLOR} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#F7F4EB', // Krem terang untuk kartu
    borderRadius: 15,
    marginHorizontal: 15,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 15,
    margin: 8,
  },
  detailsContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 15,
    justifyContent: 'space-between',
  },
  date: {
    color: PRIMARY_COLOR,
    fontSize: 12,
    fontFamily: 'Alatsi',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BACKGROUND_COLOR,
    marginTop: 2,
    fontFamily: 'Alatsi',
  },
  description: {
    fontSize: 10,
    color: BACKGROUND_COLOR,
    lineHeight: 14,
    marginTop: 5,
    marginBottom: 8,
    fontFamily: 'Alatsi',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: BACKGROUND_COLOR,
    fontFamily: 'Alatsi',
  },
  editButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  deleteButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  qrButton: {
    backgroundColor: PRIMARY_COLOR,
    width: 35,
    height: 35,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
});

export default EventItem;