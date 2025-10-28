import React from 'react';
import { View, Button, Text, ScrollView, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function GalleryScreen({ navigation }) {
  const fakeImages = Array.from({ length: 20 }, (_, i) => i + 1);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Galeria</Text>

      <ScrollView>
        <View style={styles.grid}>
          {fakeImages.map((num) => (
            <View key={num} style={styles.image}>
              <Text style={styles.imageText}>Obraz {num}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={{paddingVertical: 20}}>
        <Button
          color={colors.accent}
          title="Powrót do menu"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      color: colors.text,
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 20,
    },
      scrollContent: {
      flexGrow: 1,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    image: {
      backgroundColor: 'white',
      width: '48%',
      height: 120,
      marginBottom: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
});