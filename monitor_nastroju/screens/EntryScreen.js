import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function EntryScreen({ navigation }) {
  return <View style={styles.container}>
    <Text style={styles.title}>Wpisy</Text>
    <View style={styles.buttonContainer}>
      <Button
        color={colors.accent}
        title="Dodaj wpis"
        onPress={() => {}}
      />
    </View>
    <View style={styles.buttonContainer}>
      <Button
        color={colors.accent}
        title="Powrót" 
        onPress={() => navigation.goBack()}
      />
    </View>
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
    },
    buttonContainer: {
      padding: 10,
    }
});