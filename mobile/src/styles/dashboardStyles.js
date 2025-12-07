import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const dashboardStyles = StyleSheet.create({
    // --- PAGE HEADER ---
    pageHeader: {
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 15,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterText: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 5,
        color: '#000',
    },

    // --- LIST CONTAINER ---
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100, // Space for bottom nav
    },
    columnWrapper: {
        justifyContent: 'space-between', // For Grid 2 columns
    },

    // --- CARD STYLES: GRID (HOME) ---
    cardGrid: {
        width: (width - 50) / 2, // Half screen width minus padding
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 2, // Android Shadow
        shadowColor: '#000', // iOS Shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageContainer: {
        position: 'relative',
    },
    cardImageGrid: {
        width: '100%',
        height: 120,
        backgroundColor: '#eee',
    },
    bookmarkIconOverlay: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 8,
        padding: 4,
    },
    cardContentGrid: {
        padding: 10,
    },
    buttonRowGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        gap: 5,
    },

    // --- CARD STYLES: LIST (FEEDBACK & SAVED) ---
    cardList: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 1,
    },
    cardImageList: {
        width: 100,
        height: 100,
        borderRadius: 12,
        marginRight: 12,
        backgroundColor: '#eee',
    },
    cardContentList: {
        flex: 1,
        justifyContent: 'space-between',
    },
    cardHeaderList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonRowList: {
        flexDirection: 'row',
        marginTop: 5,
    },

    // --- TYPOGRAPHY ---
    dateText: { fontSize: 10, color: '#999', marginBottom: 2 },
    titleText: { fontSize: 14, fontWeight: 'bold', color: '#000', marginBottom: 2 },
    descText: { fontSize: 11, color: '#666', lineHeight: 14 },

    // --- BUTTONS ---
    btnGold: {
        backgroundColor: '#F4B400',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 10,
        alignItems: 'center',
        flex: 1,
    },
    btnGoldOutline: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F4B400',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 10,
        alignItems: 'center',
        flex: 1,
    },
    btnGrayFull: {
        backgroundColor: '#9CA3AF',
        borderRadius: 20,
        paddingVertical: 8,
        alignItems: 'center',
        marginTop: 5,
    },
    btnGraySmall: {
        backgroundColor: '#9CA3AF',
        borderRadius: 20,
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnGoldSmall: {
        backgroundColor: '#F4B400',
        borderRadius: 20,
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnTextWhite: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
    btnTextGold: { fontSize: 10, fontWeight: 'bold', color: '#F4B400' },

    // --- DETAIL PAGE STYLES ---
    detailImageContainer: { width: '100%', height: 250, position: 'relative' },
    detailImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    backButton: { position: 'absolute', top: 40, left: 20, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: 8 },
    detailContent: { padding: 20 },
    detailDate: { color: '#F4B400', fontWeight: 'bold', fontSize: 14, marginBottom: 5 },
    detailTitle: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    detailMetaRow: { flexDirection: 'row', marginBottom: 20, gap: 15 },
    detailMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    detailMetaText: { color: '#666', fontSize: 14 },
    sectionHeading: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    loremText: { fontSize: 14, lineHeight: 22, color: '#666', textAlign: 'justify' },
    detailFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
    btnJoinLarge: { backgroundColor: '#F4B400', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
    btnTextWhiteLarge: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    // --- MODAL STYLES ---
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 5 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 5, color: '#333' },
    modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
    qrPlaceholder: { marginBottom: 20, padding: 10, backgroundColor: '#fff', borderRadius: 10 },
    qrImage: { width: 180, height: 180 },
    scanText: { fontSize: 12, color: '#888', marginBottom: 20 },
    closeButton: { backgroundColor: '#F4B400', borderRadius: 25, paddingVertical: 10, paddingHorizontal: 30, elevation: 2 },
    closeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    // Feedback Modal Specifics
    ratingContainer: { flexDirection: 'row', marginBottom: 20 },
    reviewInput: { width: '100%', height: 100, borderColor: '#ddd', borderWidth: 1, borderRadius: 10, padding: 10, textAlignVertical: 'top', marginBottom: 20 },
    submitButton: { backgroundColor: '#F4B400', borderRadius: 12, paddingVertical: 12, width: '100%', alignItems: 'center', marginBottom: 10 },
    cancelButton: { paddingVertical: 10 },
    cancelButtonText: { color: '#999', fontSize: 14 },
});
