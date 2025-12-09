import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { ThemeContext } from '../ThemeContext';

export default function QuoteScreen() {
    const { theme } = useContext(ThemeContext);
    const [quote, setQuote] = useState('');
    const [subscription, setSubscription] = useState(null);

    const quotes = [
        'Nigdy nie rezygnuj z marzeń.',
        'Każdy dzień jest nową szansą.',
        'Sukces to suma małych wysiłków powtarzanych codziennie.',
        'Rób to, co możesz, z tym co masz, tam gdzie jesteś.',
        'Najlepszy czas na działanie jest teraz.',
        'Nie każdy dzień jest dobry, ale każdy może być trochę lżejszy.',
        'Wolniej też znaczy do przodu.',
        'Czasem ‘nie wiem’ to też dobra odpowiedź.',
        'Nie wszystko musi być perfekcyjne, żeby było super.',
        'Nie wstydź się potrzebować przerwy. To nie porażka — to reset.',
        'Nie szukaj idealnego dnia — zrób ten zwykły trochę lepszym.',
        'Masz prawo do gorszego dnia. To nie znaczy, że wszystko się sypie.'
    ];

    const handleRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
    };

    const SHAKE_THRESHOLD = 4;

    const subscribe = () => {
        setSubscription(
            Accelerometer.addListener(acc => {
                const totalForce =
                    Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);

                if (totalForce > SHAKE_THRESHOLD) {
                    handleRandomQuote();
                }
            })
        );
        Accelerometer.setUpdateInterval(500);
    };

    const unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };

    useEffect(() => {
        subscribe();
        return () => unsubscribe();
    }, []);

    const styles = StyleSheet.create({
        container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: theme.background },
        infoText: { color: theme.text, fontSize: 18, marginBottom: 40, opacity: 0.7 },
        quote: { color: theme.text, fontSize: 20, fontStyle: 'italic', textAlign: 'center', marginTop: 30 },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.infoText}>Potrząśnij, aby wylosować cytat</Text>
            {quote !== '' && <Text style={styles.quote}>{quote}</Text>}
        </View>
    );
}
