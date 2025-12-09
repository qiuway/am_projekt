import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../styles/colors';
import { login } from '../api/client';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) return Alert.alert("Błąd", "Podaj wszystkie dane.");

        setLoading(true);
        try {
            const { token, user } = await login(username, password);
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            navigation.replace('Home');
        } catch (err) {
            Alert.alert("Błąd logowania", err.response?.data?.message || "Niepoprawne dane.");
        } finally { setLoading(false); }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Zaloguj się</Text>
            <TextInput style={styles.input} placeholder="Nazwa użytkownika" value={username} onChangeText={setUsername} autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Hasło" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title={loading ? "Logowanie..." : "Zaloguj"} color={colors.accent} onPress={handleLogin} disabled={loading} />
            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 20 }}>
                <Text style={{ color: colors.accent, textAlign: 'center' }}>Nie masz konta? Zarejestruj się</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.background },
    title: { fontSize: 24, color: colors.text, textAlign: 'center', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: colors.accent, color: colors.text, borderRadius: 8, padding: 10, marginBottom: 15 },
});

/*import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../styles/colors';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState({});

    useEffect(() => {
        const loadUsers = async () => {
            const storedUsers = await AsyncStorage.getItem('users');
            let parsed = storedUsers ? JSON.parse(storedUsers) : {};
            if (!parsed['1']) parsed['1'] = '1'; // domyślny użytkownik
            await AsyncStorage.setItem('users', JSON.stringify(parsed));
            setUsers(parsed);
        };
        loadUsers();
    }, []);

    const handleLogin = async () => {
        if (users[username] && users[username] === password) {
            await AsyncStorage.setItem('loggedUser', username);
            navigation.replace('Home');
        } else {
            Alert.alert('Błąd logowania', 'Niepoprawna nazwa użytkownika lub hasło');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Zaloguj się</Text>
            <TextInput
                style={styles.input}
                placeholder="Nazwa użytkownika"
                placeholderTextColor="#888"
                value={username}
                onChangeText={setUsername}
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
            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 20 }}>
                <Text style={{ color: colors.accent, textAlign: 'center' }}>Nie masz konta? Zarejestruj się</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.background },
    title: { fontSize: 24, color: colors.text, textAlign: 'center', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: colors.accent, color: colors.text, borderRadius: 8, padding: 10, marginBottom: 15 },
});
*/