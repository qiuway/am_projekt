import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          color={colors.accent}
          title="Wpisy" 
          onPress={() => navigation.replace('Entry')} 
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          color={colors.accent}
          title="Statystyki" 
          onPress={() => navigation.replace('Statistics')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          color={colors.accent}
          title="Medytacja" 
          onPress={() => navigation.replace('Meditation')} 
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          color={colors.accent}
          title="Galeria" 
          onPress={() => navigation.replace('Gallery')} 
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          color={colors.accent}
          title="Cytat na dziś" 
          onPress={() => navigation.replace('Quote')} 
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          color={colors.accent}
          title="Ustawienia"
          onPress={() => navigation.replace('Options')}
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
  buttonContainer: {
    marginVertical: 10,
  },
});
