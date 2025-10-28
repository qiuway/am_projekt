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
          onPress={() => navigation.navigate('Entry')} 
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          color={colors.accent}
          title="Statystyki" 
          onPress={() => navigation.navigate('Statistics')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          color={colors.accent}
          title="Medytacja" 
          onPress={() => navigation.navigate('Meditation')} 
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          color={colors.accent}
          title="Galeria" 
          onPress={() => navigation.navigate('Gallery')} 
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          color={colors.accent}
          title="Cytat na dziś" 
          onPress={() => navigation.navigate('Quote')} 
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          color={colors.accent}
          title="Ustawienia"
          onPress={() => navigation.navigate('Options')}
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
