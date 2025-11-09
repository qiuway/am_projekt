import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function QuoteScreen() {
  const [quote, setQuote] = useState('');

  const quotes = [
    'Nigdy nie rezygnuj z marzeń.',
    'Każdy dzień jest nową szansą.',
    'Sukces to suma małych wysiłków powtarzanych codziennie.',
    'Rób to, co możesz, z tym co masz, tam gdzie jesteś.',
    'Najlepszy czas na działanie jest teraz.',
    'Nie każdy dzień jest dobry, ale każdy może być trochę lżejszy.',
    'Wolniej też znaczy do przodu.',
    'Czasem ‘nie wiem’ to też dobra odpowiedź.',
    'Nie wszystko musi być perfekcyjne, żeby było super.',
    'Nie wstydź się potrzebować przerwy. To nie porażka — to reset.',
    'Nie szukaj idealnego dnia — zrób ten zwykły trochę lepszym.',
    'Masz prawo do gorszego dnia. To nie znaczy, że wszystko się sypie.'
  ];

  const handlePress = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Wylosuj cytat</Text>
      </TouchableOpacity>

      {quote !== '' && <Text style={styles.quote}>{quote}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  quote: {
    color: colors.text,
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 30,
  },
});
