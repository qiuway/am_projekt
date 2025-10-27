import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

//--------------------------e-mail i hasło to "1"---------------------------------

    const handleLogin = () => {
        if (email === '1' && password === '1') {
            navigation.replace('Home');
        } else {
            Alert.alert('Błąd logowania', 'Niepoprawny e-mail lub hasło');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Zaloguj się</Text>
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Hasło"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Zaloguj" color={colors.accent} onPress={handleLogin} />
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
    input: {
        borderColor: colors.accent,
        color: colors.text,
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
});
