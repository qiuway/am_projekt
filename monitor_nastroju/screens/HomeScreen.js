import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        color={colors.accent}
        title="Wpisy" 
        onPress={() => navigation.replace('Entry')} 
      />
      <View style={{ height: 20 }} />
      <Button
        color={colors.accent}
        title="Statystyki" 
        onPress={() => navigation.replace('Statistics')}
      />
      <View style={{ height: 20 }} />
      <Button
        color={colors.accent}
        title="Medytacja" 
        onPress={() => navigation.replace('Meditation')} 
      />
      <View style={{ height: 20 }} />
      <Button
        color={colors.accent}
        title="Galeria" 
        onPress={() => navigation.replace('Gallery')} 
      />
      <View style={{ height: 20 }} />
      <Button
        color={colors.accent}
        title="Cytat na dziś" 
        onPress={() => navigation.replace('Quote')} 
      />
      <View style={{ height: 20 }} />
      <Button
        color={colors.accent}
        title="Ustawienia"
        onPress={() => navigation.replace('Options')}
      />
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
});

