import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../styles/colors';
import { register } from '../api/client';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !password) return Alert.alert("Błąd", "Wypełnij wszystkie pola.");

        setLoading(true);
        try {
            await register(username, password);
            Alert.alert("Sukces", "Konto utworzone!", [{ text: "OK", onPress: () => navigation.navigate('Login') }]);
        } catch (err) {
            Alert.alert("Błąd rejestracji", err.response?.data?.message || "Nie udało się utworzyć konta.");
        } finally { setLoading(false); }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rejestracja</Text>
            <TextInput style={styles.input} placeholder="Nazwa użytkownika" value={username} onChangeText={setUsername} autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Hasło" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title={loading ? "Tworzenie..." : "Zarejestruj"} color={colors.accent} onPress={handleRegister} disabled={loading} />
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