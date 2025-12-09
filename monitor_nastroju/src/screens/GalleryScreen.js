import React, { useContext } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../../ThemeContext';

export default function GalleryScreen() {
    const { theme } = useContext(ThemeContext);
    const fakeImages = Array.from({ length: 20 }, (_, i) => i + 1);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: theme.background,
        },
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        image: {
            backgroundColor: theme.accent,
            width: '48%',
            height: 120,
            marginBottom: 15,
            justifyContent: 'center',
            alignItems: 'center',
        },
        imageText: {
            color: '#fff',
            fontWeight: 'bold',
        },
    });

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.grid}>
                    {fakeImages.map((num) => (
                        <View key={num} style={styles.image}>
                            <Text style={styles.imageText}>Obraz {num}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
