import React, { useEffect, useRef, useState, useContext } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet} from 'react-native';
import { Audio } from 'expo-av';
import { ThemeContext } from '../../ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function MeditationSession({ navigation, route }) {
    const { theme } = useContext(ThemeContext);
    const { type = 'Szybki Start', time = '5 min' } = route.params || {};
    
    const totalSeconds = parseInt(time) * 60;
    const [timeLeft, setTimeLeft] = useState(totalSeconds);
    const [isMuted, setIsMuted] = useState(false);

    const phases = ['Wdech', 'Wstrzymanie', 'Wydech', 'Wstrzymanie'];
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [secondsInPhase, setSecondsInPhase] = useState(4);
    
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0.4)).current;
    const timerRef = useRef(null);
    const soundRef = useRef(null);

    //Funkcja obsługi dżwięku
const loadAndPlaySound = async () => {
    try {
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
        });

        const { sound } = await Audio.Sound.createAsync(
            require('../../assets/audio/mini-zen-drone-short-450970.mp3'), 
            { 
                shouldPlay: true, 
                isLooping: true, 
                volume: 0.4 
            }
        );
        soundRef.current = sound;
    } catch (error) {
        console.log("Błąd ładowania dźwięku", error);
    }
};

    const toggleMute = async () => {
        if (soundRef.current) {
            const newMuteStatus = !isMuted;
            await soundRef.current.setIsMutedAsync(newMuteStatus);
            setIsMuted(newMuteStatus);
        }
    };

    const startAnimationForPhase = (phase) => {
        let toScale = 1;
        let toOpacity = 0.4;
        if (phase === 'Wdech') { toScale = 1.6; toOpacity = 0.8; }
        else if (phase === 'Wydech') { toScale = 1.0; toOpacity = 0.4; }
        else { toScale = scaleAnim._value; }

        Animated.parallel([
            Animated.timing(scaleAnim, { toValue: toScale, duration: 4000, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: toOpacity, duration: 4000, useNativeDriver: true })
        ]).start();
    };

    useEffect(() => {
        loadAndPlaySound(); // Start dźwięku
        
        return () => {
            if (soundRef.current) {
                soundRef.current.stopAsync();
                soundRef.current.unloadAsync(); // Zwolnienie pamięci po wyjściu
            }
        };
    }, []);

    useEffect(() => {
        startAnimationForPhase(phases[phaseIndex]);
        setSecondsInPhase(4);

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    navigation.goBack();
                    return 0;
                }
                return prev - 1;
            });

            setSecondsInPhase((prev) => {
                if (prev <= 1) {
                    setPhaseIndex((prevIndex) => (prevIndex + 1) % phases.length);
                    return 4;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [phaseIndex]);

    const formatTime = (s) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.typeText, { color: theme.text }]}>{type}</Text>
                <Text style={[styles.totalTimer, { color: theme.text }]}>Pozostało: {formatTime(timeLeft)}</Text>
            </View>

            <View style={styles.animationContainer}>
                <View style={[styles.outlineCircle, { borderColor: theme.accent }]} />
                <Animated.View style={[styles.circle, { backgroundColor: theme.accent, transform: [{ scale: scaleAnim }], opacity: opacityAnim }]} />
                <View style={styles.textOverlay}>
                    <Text style={styles.phaseText}>{phases[phaseIndex]}</Text>
                    <Text style={styles.secondsText}>{secondsInPhase}</Text>
                </View>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity style={styles.iconButton} onPress={toggleMute}>
                    <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={30} color={theme.text} />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.endButton, { backgroundColor: theme.accent }]} 
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.endText}>Zakończ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 60 },
    header: { alignItems: 'center' },
    typeText: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
    totalTimer: { fontSize: 16, opacity: 0.6 },
    animationContainer: { justifyContent: 'center', alignItems: 'center', width: 300, height: 300 },
    circle: { width: 150, height: 150, borderRadius: 75, position: 'absolute' },
    outlineCircle: { width: 240, height: 240, borderRadius: 120, borderWidth: 1, position: 'absolute', opacity: 0.1, borderStyle: 'dashed' },
    textOverlay: { alignItems: 'center' },
    phaseText: { fontSize: 24, fontWeight: '600', color: '#fff' },
    secondsText: { fontSize: 45, fontWeight: 'bold', color: '#fff' },
    controls: { width: '100%', alignItems: 'center' },
    iconButton: { marginBottom: 30 },
    endButton: { paddingVertical: 15, paddingHorizontal: 60, borderRadius: 30 },
    endText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});