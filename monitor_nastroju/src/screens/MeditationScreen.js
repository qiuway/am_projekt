import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../../ThemeContext';

export default function MeditationScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);

    const styles = StyleSheet.create({
        container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background },
        button: {
            backgroundColor: theme.accent,
            paddingVertical: 15,
            paddingHorizontal: 40,
            borderRadius: 30,
            elevation: 4,
        },
        buttonText: { color: '#fff', fontSize: 18, fontWeight: '600', textTransform: 'uppercase' },
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MeditationSession')}>
                <Text style={styles.buttonText}>Rozpocznij medytację</Text>
            </TouchableOpacity>
        </View>
    );
}