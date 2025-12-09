import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../styles/colors';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState({});

    useEffect(() => {
        const loadUsers = async () => {
            const storedUsers = await AsyncStorage.getItem('users');
            setUsers(storedUsers ? JSON.parse(storedUsers) : {});
        };
        loadUsers();
    }, []);

    const handleRegister = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert('Błąd', 'Wypełnij wszystkie pola');
            return;
        }
        if (users[username]) {
            Alert.alert('Błąd', 'Użytkownik o takiej nazwie już istnieje');
            return;
        }

        const updatedUsers = { ...users, [username]: password };
        await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
        await AsyncStorage.setItem(`userData_${username}`, JSON.stringify({ entries: [] })); // osobne dane użytkownika

        Alert.alert('Sukces', 'Konto utworzone', [
            { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rejestracja</Text>
            <TextInput
                style={styles.input}
                placeholder="Nazwa użytkownika"
                placeholderTextColor="#888"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Hasło"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Zarejestruj" color={colors.accent} onPress={handleRegister} />
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 20 }}>
                <Text style={{ color: colors.accent, textAlign: 'center' }}>Powrót do logowania</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.background },
    title: { fontSize: 24, color: colors.text, textAlign: 'center', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: colors.accent, color: colors.text, borderRadius: 8, padding: 10, marginBottom: 15 },
});
