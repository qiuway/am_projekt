import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../../ThemeContext';
import { getEntries, addEntry, updateEntry, deleteEntry as deleteEntryAPI } from '../api/client';

const emotions = [
    { label: '😄', name: 'szczęśliwy' },
    { label: '😐', name: 'neutralny' },
    { label: '😢', name: 'smutny' },
    { label: '😡', name: 'zły' },
    { label: '😴', name: 'zmęczony' },
];

export default function EntryScreen() {
    const { theme } = useContext(ThemeContext);

    const [currentUser, setCurrentUser] = useState(null);
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState('');
    const [hasImage, setHasImage] = useState(false);
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [sortOption, setSortOption] = useState('newest');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

//pobranie aktualnie zalogowanego użytkownika
    useEffect(() => {
        const loadUser = async () => {
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            if (user) setCurrentUser(user);
        };
        loadUser();
    }, []);

//ładowanie wpisów po ustawieniu currentUser
    useEffect(() => {
        if (currentUser) loadEntries();
    }, [currentUser]);

    const loadEntries = async () => {
        try {
            const data = await getEntries(currentUser.id);
            setEntries(data.sort((a,b) => new Date(b.date) - new Date(a.date)));
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
            hasImage,
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
            setHasImage(false);
            setSelectedEmotion(null);
            setSelectedDate(new Date());
        } catch (e) {
            console.log('Błąd zapisu wpisu:', e);
        }
    };

    const editEntry = (entry) => {
        setNewEntry(entry.text);
        setHasImage(entry.hasImage || false);
        setSelectedEmotion(entry.emotion || null);
        setEditingId(entry.id);
        setSelectedDate(new Date(entry.date));
    };

    const deleteEntry = async (id) => {
        try {
            await deleteEntryAPI(id);
            setEntries(entries.filter(e => e.id !== id));
        } catch (e) {
            console.log('Błąd usuwania wpisu:', e);
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

    let sortedEntries = [...entries];

    switch (sortOption) {
        case 'oldest':
            sortedEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'favorites':
            sortedEntries = sortedEntries.filter(e => e.favorite);
            sortedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        default:
            sortedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    const renderItem = ({ item }) => (
        <View style={[styles.entry, { backgroundColor: theme.accent }]}>
            <View style={styles.entryHeader}>
                <Text style={[styles.entryText, { color: theme.background }]}>{item.text}</Text>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                    <Text style={{ fontSize: 22 }}>{item.favorite ? '⭐' : '☆'}</Text>
                </TouchableOpacity>
            </View>

            {item.emotion && (
                <Text style={[styles.entryEmotion, { color: theme.background }]}>
                    Emocja dnia: {item.emotion.label} ({item.emotion.name})
                </Text>
            )}

            <Text style={[styles.entryDate, { color: theme.background }]}>
                {new Date(item.date).toLocaleDateString('pl-PL')}
            </Text>

            <View style={styles.entryButtons}>
                <TouchableOpacity
                    style={[styles.smallButton, { backgroundColor: theme.background }]}
                    onPress={() => editEntry(item)}
                >
                    <Text style={[styles.buttonText, { color: theme.accent }]}>Edytuj</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.smallButton, { backgroundColor: theme.background }]}
                    onPress={() => deleteEntry(item.id)}
                >
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
                        style={[
                            styles.emotionButton,
                            { backgroundColor: selectedEmotion?.name === emo.name ? theme.accent : '#ccc' }
                        ]}
                        onPress={() => setSelectedEmotion(emo)}
                    >
                        <Text style={{ fontSize: 22 }}>{emo.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={[styles.mainButton, { backgroundColor: theme.accent }]}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={styles.buttonText}>📅 {selectedDate.toLocaleDateString('pl-PL')}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                        setShowDatePicker(false);
                        if (date) setSelectedDate(date);
                    }}
                />
            )}

            <TouchableOpacity
                style={[styles.mainButton, { backgroundColor: theme.accent }]}
                onPress={() => setHasImage(!hasImage)}
            >
                <Text style={styles.buttonText}>
                    {hasImage ? '📸 Zdjęcie dodane' : 'Dodaj zdjęcie'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.mainButton, { backgroundColor: theme.accent }]}
                onPress={addOrEditEntry}
            >
                <Text style={styles.buttonText}>{editingId ? '💾 Zapisz zmiany' : '➕ Dodaj wpis'}</Text>
            </TouchableOpacity>

            <View style={styles.sortBar}>
                {['newest', 'oldest', 'favorites'].map(option => (
                    <TouchableOpacity key={option} onPress={() => setSortOption(option)}>
                        <Text style={[styles.sortButton, sortOption === option && { color: theme.accent }]}>
                            {option === 'newest' ? 'Najnowsze' : option === 'oldest' ? 'Najstarsze' : 'Ulubione'}
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
    entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    entryText: { fontSize: 16, marginBottom: 5, flexShrink: 1 },
    entryDate: { fontSize: 12, fontStyle: 'italic', marginBottom: 10 },
    entryButtons: { flexDirection: 'row', justifyContent: 'space-between' },
    emotionsContainer: { flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between' },
    emotionButton: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    entryEmotion: { fontSize: 14, marginBottom: 8 },
    sortBar: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
    sortButton: { fontSize: 16, fontWeight: '600', color: '#666' },
});
