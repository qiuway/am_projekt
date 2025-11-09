import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../styles/colors';

export default function MeditationSession({ navigation }) {
  const phases = ['Wdech', 'Wstrzymanie', 'Wydech', 'Wstrzymanie'];
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [seconds, setSeconds] = useState(3);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  const startAnimationForPhase = (phase) => {
    let toValue = 1;
    let duration = 3000;

    if (phase === 'Wdech') {
      toValue = 1.6; // rozszerzenie
    } else if (phase === 'Wydech') {
      toValue = 1.0; // skurczenie
    } else if (phase === 'Wstrzymanie') {
      // nie zmieniaj rozmiaru
      toValue = scaleAnim.__getValue ? scaleAnim.__getValue() : 1;
      duration = 0;
    }

    Animated.timing(scaleAnim, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const currentPhase = phases[phaseIndex];
    startAnimationForPhase(currentPhase);
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

  useEffect(() => {
    startAnimationForPhase(phases[0]);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          { transform: [{ scale: scaleAnim }] },
        ]}
      />

      <Text style={styles.text}>{phases[phaseIndex]}</Text>
      <Text style={styles.timer}>{seconds}</Text>

      <TouchableOpacity
        style={styles.endButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.endText}>Zakończ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.accent,
    opacity: 0.6,
    marginBottom: 60,
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'rgba(44, 93, 59, 1)7',
    marginBottom: 40,
  },
  timer: {
    fontSize: 60,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 30,
  },
  endButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  endText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
