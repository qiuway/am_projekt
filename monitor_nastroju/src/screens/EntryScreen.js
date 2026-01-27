import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../../ThemeContext';
import { getEntries, addEntry, updateEntry, deleteEntry as deleteEntryAPI } from '../api/client';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const emotions = [
    { label: '😄', name: 'szczęśliwy' },
    { label: '😐', name: 'neutralny' },
    { label: '😢', name: 'smutny' },
    { label: '😡', name: 'zły' },
    { label: '😴', name: 'zmęczony' },
];

export default function EntryScreen() {
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();

    const [currentUser, setCurrentUser] = useState(null);
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState('');
    const [hasImage, setHasImage] = useState(false);
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [sortOption, setSortOption] = useState('newest');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [imageUri, setImageUri] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            if (user) setCurrentUser(user);
        };
        loadUser();
    }, []);

    useEffect(() => {
        if (currentUser) loadEntries();
    }, [currentUser]);

    const loadEntries = async () => {
        try {
            const data = await getEntries(currentUser.id);
            setEntries(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (e) {
            console.log('Błąd ładowania wpisów:', e);
        }
    };

    const addOrEditEntry = async () => {
        if (!currentUser) return Alert.alert('Błąd', 'Nieprawidłowy użytkownik');
        if (!newEntry.trim()) return Alert.alert('Błąd', 'Wpis nie może być pusty!');
        if (!selectedEmotion) return Alert.alert('Błąd', 'Wybierz emocję dnia!');

        const entryData = {
            userId: currentUser.id,
            text: newEntry,
            imageUri, 
            emotion: selectedEmotion,
            favorite: false,
            date: selectedDate.toISOString(),
        };

        try {
            if (editingId) {
                const updated = await updateEntry(editingId, entryData);
                setEntries(entries.map(e => e.id === editingId ? updated : e));
                setEditingId(null);
            } else {
                const saved = await addEntry(entryData);
                setEntries([saved, ...entries]);
            }
            setNewEntry('');
            setImageUri(null);
            setHasImage(false);
            setSelectedEmotion(null);
            setSelectedDate(new Date());
        } catch (e) {
            console.log('Błąd zapisu wpisu:', e);
        }
    };

    const toggleFavorite = async (id) => {
        const entry = entries.find(e => e.id === id);
        if (!entry) return;
        try {
            const updated = await updateEntry(id, { ...entry, favorite: !entry.favorite });
            setEntries(entries.map(e => e.id === id ? updated : e));
        } catch (e) {
            console.log('Błąd togglowania ulubionego:', e);
        }
    };

    const pickFromGallery = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return Alert.alert('Brak dostępu', 'Potrzebny dostęp do galerii');
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setHasImage(true);
        }
    };

    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) return Alert.alert('Brak dostępu', 'Potrzebny dostęp do aparatu');
        const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setHasImage(true);
        }
    };

    let sortedEntries = [...entries];
    if (sortOption === 'oldest') sortedEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sortOption === 'favorites') sortedEntries = sortedEntries.filter(e => e.favorite);
    else sortedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

    const renderItem = ({ item }) => (
        <View style={[styles.entry, { backgroundColor: theme.accent }]}>
            <View style={styles.entryMainContent}>
                {item.imageUri && (
                    <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
                )}
                <View style={styles.entryTextContainer}>
                    <View style={styles.entryHeader}>
                        <Text style={[styles.entryText, { color: theme.background }]}>{item.text}</Text>
                        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                            <Text style={{ fontSize: 22 }}>{item.favorite ? '⭐' : '☆'}</Text>
                        </TouchableOpacity>
                    </View>
                    {item.emotion && (
                        <Text style={[styles.entryEmotion, { color: theme.background }]}>
                            {item.emotion.label} {item.emotion.name}
                        </Text>
                    )}
                    <Text style={[styles.entryDate, { color: theme.background }]}>
                        {new Date(item.date).toLocaleDateString('pl-PL')}
                    </Text>
                </View>
            </View>
            <View style={styles.entryButtons}>
                <TouchableOpacity style={[styles.smallButton, { backgroundColor: theme.background }]} onPress={() => {
                    setNewEntry(item.text);
                    setImageUri(item.imageUri || null);
                    setSelectedEmotion(item.emotion);
                    setEditingId(item.id);
                    setSelectedDate(new Date(item.date));
                }}>
                    <Text style={[styles.buttonText, { color: theme.accent }]}>Edytuj</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.smallButton, { backgroundColor: theme.background }]} onPress={() => deleteEntryAPI(item.id).then(() => setEntries(entries.filter(e => e.id !== item.id)))}>
                    <Text style={[styles.buttonText, { color: theme.accent }]}>Usuń</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <TextInput
                style={[styles.input, { borderColor: theme.accent, color: theme.text }]}
                placeholder="Napisz nowy wpis..."
                placeholderTextColor="#888"
                value={newEntry}
                onChangeText={setNewEntry}
            />

            <View style={styles.emotionsContainer}>
                {emotions.map(emo => (
                    <TouchableOpacity
                        key={emo.name}
                        style={[styles.emotionButton, { backgroundColor: selectedEmotion?.name === emo.name ? theme.accent : '#ccc' }]}
                        onPress={() => setSelectedEmotion(emo)}
                    >
                        <Text style={{ fontSize: 22 }}>{emo.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={[styles.mainButton, { backgroundColor: theme.accent }]} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.buttonText}>📅 {selectedDate.toLocaleDateString('pl-PL')}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={(event, date) => { setShowDatePicker(false); if (date) setSelectedDate(date); }}
                />
            )}

            <TouchableOpacity
                style={[styles.mainButton, { backgroundColor: theme.accent }]}
                onPress={() => Alert.alert('Dodaj zdjęcie', 'Wybierz źródło', [
                    { text: '📷 Zrób zdjęcie', onPress: takePhoto },
                    { text: '🖼 Wybierz z galerii', onPress: pickFromGallery },
                    { text: 'Anuluj', style: 'cancel' },
                ])}
            >
                <Text style={styles.buttonText}>{imageUri ? '📸 Zdjęcie wybrane' : '🖼 Dodaj zdjęcie'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.mainButton, { backgroundColor: theme.accent }]} onPress={addOrEditEntry}>
                <Text style={styles.buttonText}>{editingId ? '💾 Zapisz zmiany' : '➕ Dodaj wpis'}</Text>
            </TouchableOpacity>

            <View style={styles.sortBar}>
                {['newest', 'oldest', 'favorites', 'gallery'].map(option => (
                    <TouchableOpacity 
                        key={option} 
                        onPress={() => {
                            if (option === 'gallery') {
                                navigation.navigate('Gallery'); 
                            } else {
                                setSortOption(option);
                            }
                        }}
                    >
                        <Text style={[
                            styles.sortButton, 
                            sortOption === option && option !== 'gallery' && { color: theme.accent },
                            option === 'gallery' && { fontWeight: 'bold' }
                        ]}>
                            {option === 'newest' ? 'Najnowsze' : 
                             option === 'oldest' ? 'Najstarsze' : 
                             option === 'favorites' ? 'Ulubione' : '🖼 Galeria'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={sortedEntries}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ marginTop: 10 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    input: { borderWidth: 1, borderRadius: 12, padding: 10, marginBottom: 12 },
    mainButton: { paddingVertical: 14, borderRadius: 30, alignItems: 'center', marginBottom: 10, elevation: 2 },
    smallButton: { flex: 1, paddingVertical: 8, borderRadius: 20, alignItems: 'center', marginHorizontal: 5, elevation: 1 },
    buttonText: { fontWeight: '600', fontSize: 16, color: '#fff' },
    entry: { padding: 15, borderRadius: 12, marginBottom: 12 },
    entryMainContent: { flexDirection: 'row', marginBottom: 10 },
    thumbnail: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
    entryTextContainer: { flex: 1 },
    entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    entryText: { fontSize: 16, marginBottom: 5, flexShrink: 1, fontWeight: '500' },
    entryDate: { fontSize: 11, fontStyle: 'italic' },
    entryButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
    emotionsContainer: { flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between' },
    emotionButton: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    entryEmotion: { fontSize: 13, marginBottom: 4 },
    sortBar: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10, alignItems: 'center' },
    sortButton: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#666',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 15,
},
});