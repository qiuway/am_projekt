import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function GalleryScreen() {
  return <View style={styles.container}>
    <Text style={styles.title}>Galeria</Text>
  </View>;
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
    }
});