import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../ThemeContext';
import { useFocusEffect } from '@react-navigation/native';

const emotions = [
    { label: '😄', name: 'szczęśliwy' },
    { label: '😐', name: 'neutralny' },
    { label: '😢', name: 'smutny' },
    { label: '😡', name: 'zły' },
    { label: '😴', name: 'zmęczony' },
];

export default function StatisticsScreen() {
    const { theme } = useContext(ThemeContext);
    const [entries, setEntries] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [counts, setCounts] = useState({});
    const [mode, setMode] = useState('month'); // 'month' lub 'year'
    const animatedBars = useRef({}).current; // przechowuje Animated.Value dla każdego słupka

    const monthNames = [
        'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
        'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];

    useFocusEffect(
        React.useCallback(() => {
            loadEntries();
        }, [])
    );

    useEffect(() => {
        calculateStats();
    }, [entries, selectedMonth, selectedYear, mode]);

    const loadEntries = async () => {
        try {
            const loggedUser = await AsyncStorage.getItem('loggedUser');
            if (!loggedUser) return;

            const storedEntries = await AsyncStorage.getItem(`userEntries_${loggedUser}`);
            if (storedEntries) {
                setEntries(JSON.parse(storedEntries));
            } else {
                setEntries([]);
            }
        } catch (e) {
            console.log('Błąd ładowania wpisów:', e);
        }
    };

    const calculateStats = () => {
        const emotionCounts = {};
        emotions.forEach((e) => (emotionCounts[e.name] = 0));

        const filtered = entries.filter((entry) => {
            const date = new Date(entry.date);
            if (mode === 'month') {
                return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
            }
            return date.getFullYear() === selectedYear;
        });

        filtered.forEach((entry) => {
            if (entry.emotion && emotionCounts[entry.emotion.name] !== undefined) {
                emotionCounts[entry.emotion.name]++;
            }
        });

        setCounts(emotionCounts);

        // inicjalizacja Animated.Value dla każdego słupka
        emotions.forEach((emo) => {
            if (!animatedBars[emo.name]) {
                animatedBars[emo.name] = new Animated.Value(0);
            }
            Animated.timing(animatedBars[emo.name], {
                toValue: (emotionCounts[emo.name] / Math.max(...Object.values(emotionCounts), 1)) * 150,
                duration: 600,
                useNativeDriver: false,
            }).start();
        });
    };

    const changeMonth = (direction) => {
        let newMonth = selectedMonth + direction;
        let newYear = selectedYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }

        setSelectedMonth(newMonth);
        setSelectedYear(newYear);
    };

    const changeMode = () => {
        setMode(mode === 'month' ? 'year' : 'month');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                {mode === 'month' && (
                    <TouchableOpacity onPress={() => changeMonth(-1)}>
                        <Text style={[styles.arrow, { color: theme.accent }]}>◀️</Text>
                    </TouchableOpacity>
                )}

                <Text style={[styles.monthText, { color: theme.text }]}>
                    {mode === 'month'
                        ? `${monthNames[selectedMonth]} ${selectedYear}`
                        : `Statystyki roczne (${selectedYear})`}
                </Text>

                {mode === 'month' && (
                    <TouchableOpacity onPress={() => changeMonth(1)}>
                        <Text style={[styles.arrow, { color: theme.accent }]}>▶️</Text>
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity
                style={[styles.modeButton, { backgroundColor: theme.accent }]}
                onPress={changeMode}
            >
                <Text style={[styles.modeText, { color: theme.background }]}>
                    {mode === 'month' ? '📆 Pokaż statystyki roczne' : '📅 Pokaż miesięczne'}
                </Text>
            </TouchableOpacity>

            {Object.keys(counts).length > 0 && Object.values(counts).some(v => v > 0) ? (
                <View style={styles.chartContainer}>
                    {emotions.map((emo) => (
                        <View key={emo.name} style={styles.barColumn}>
                            <Animated.View
                                style={[
                                    styles.barVertical,
                                    { height: animatedBars[emo.name] || 0, backgroundColor: theme.accent },
                                ]}
                            />
                            <Text style={[styles.label, { color: theme.text }]}>{emo.label}</Text>
                            <Text style={[styles.value, { color: theme.text }]}>{counts[emo.name]}</Text>
                        </View>
                    ))}
                </View>
            ) : (
                <Text style={[styles.noData, { color: theme.text }]}>
                    Brak danych dla wybranego okresu 📊
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    monthText: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
    arrow: { fontSize: 28 },
    modeButton: { paddingVertical: 10, borderRadius: 20, alignItems: 'center', marginBottom: 25 },
    modeText: { fontSize: 16, fontWeight: '600' },
    chartContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 220, marginTop: 10 },
    barColumn: { alignItems: 'center' },
    barVertical: { width: 35, borderRadius: 8 },
    label: { fontSize: 26, marginTop: 6 },
    value: { fontSize: 16, marginTop: 2 },
    noData: { textAlign: 'center', marginTop: 40, fontSize: 16, fontStyle: 'italic' },
});
