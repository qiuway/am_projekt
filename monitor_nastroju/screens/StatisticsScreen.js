import React from 'react';
import { View, Button, Text, Image, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function StatisticsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
      <Image
        source={require('../assets/wykres.jpg')}
        style={styles.image}
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
    imageContainer:{
      padding: 10,
      alignItems: 'center'
    },
    buttonContainer:{
      padding: 10,
    },
    title: {
      color: colors.text,
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 20,
    },
    image: {
      width: 300,
      height: 135,
    }
});