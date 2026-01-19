import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { ThemeContext } from '../../ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// Definicja 3 kluczowych opcji medytacji
const meditationOptions = [
    { id: '1', title: 'Głęboki Spokój', duration: '5 min', icon: 'leaf-outline', color: '#4CAF50' },
    { id: '2', title: 'Redukcja Stresu', duration: '10 min', icon: 'water-outline', color: '#2196F3' },
    { id: '3', title: 'Dobry Sen', duration: '15 min', icon: 'moon-outline', color: '#673AB7' },
];

export default function MeditationScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={[styles.card, { backgroundColor: theme.accent + '15', borderColor: theme.accent }]} 
            onPress={() => navigation.navigate('MeditationSession', { type: item.title, time: item.duration })}
        >
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon} size={32} color="#fff" />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.subtitle, { color: theme.text + '99' }]}>Sesja: {item.duration}</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.accent} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.headerContainer}>
                <Text style={[styles.header, { color: theme.text }]}>Medytacja</Text>
                <Text style={[styles.subHeader, { color: theme.text + '80' }]}>Wybierz program dopasowany do Twoich potrzeb</Text>
            </View>
            
            <FlatList
                data={meditationOptions}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    headerContainer: { marginTop: 50, marginBottom: 30, alignItems: 'center' },
    header: { fontSize: 28, fontWeight: 'bold' },
    subHeader: { fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 20 },
    list: { paddingBottom: 20 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 25,
        marginBottom: 15,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconContainer: {
        width: 65,
        height: 65,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: { flex: 1 },
    title: { fontSize: 19, fontWeight: 'bold' },
    subtitle: { fontSize: 15, marginTop: 4 },
});