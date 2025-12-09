import React, { useEffect, useRef, useState, useContext } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../../ThemeContext';

export default function MeditationSession({ navigation }) {
    const { theme } = useContext(ThemeContext);
    const phases = ['Wdech', 'Wstrzymanie', 'Wydech', 'Wstrzymanie'];
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [seconds, setSeconds] = useState(3);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const timerRef = useRef(null);

    const startAnimationForPhase = (phase) => {
        let toValue = 1;
        let duration = 3000;
        if (phase === 'Wdech') toValue = 1.6;
        else if (phase === 'Wydech') toValue = 1.0;
        else if (phase === 'Wstrzymanie') {
            toValue = scaleAnim.__getValue ? scaleAnim.__getValue() : 1;
            duration = 0;
        }

        Animated.timing(scaleAnim, { toValue, duration, useNativeDriver: true }).start();
    };

    useEffect(() => {
        startAnimationForPhase(phases[phaseIndex]);
        setSeconds(3);

        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    setPhaseIndex((prevIndex) => (prevIndex + 1) % phases.length);
                    return 3;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [phaseIndex]);

    const styles = StyleSheet.create({
        container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background },
        circle: { width: 180, height: 180, borderRadius: 90, backgroundColor: theme.accent, opacity: 0.6, marginBottom: 60 },
        text: { fontSize: 40, fontWeight: 'bold', color: theme.text, marginBottom: 40 },
        timer: { fontSize: 60, fontWeight: 'bold', color: theme.accent, marginBottom: 30 },
        endButton: { position: 'absolute', bottom: 50, backgroundColor: theme.accent, paddingVertical: 14, paddingHorizontal: 40, borderRadius: 30 },
        endText: { color: '#fff', fontSize: 18, fontWeight: '600' },
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]} />
            <Text style={styles.text}>{phases[phaseIndex]}</Text>
            <Text style={styles.timer}>{seconds}</Text>
            <TouchableOpacity style={styles.endButton} onPress={() => navigation.goBack()}>
                <Text style={styles.endText}>Zakończ</Text>
            </TouchableOpacity>
        </View>
    );
}
