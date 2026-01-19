import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext, themes } from '../../ThemeContext';
import { changePassword, deleteAccount } from '../api/client';

export default function OptionsScreen({ navigation }) {
    const { theme, setTheme } = useContext(ThemeContext);
    const [showPalette, setShowPalette] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    // Pobranie zalogowanego użytkownika
    useEffect(() => {
        const loadUser = async () => {
            const stored = await AsyncStorage.getItem('user');
            if (stored) setCurrentUser(JSON.parse(stored));
        };
        loadUser();
    }, []);

    // Zmiana hasła
    const handleChangePassword = async () => {
        if (!newPassword.trim()) {
            Alert.alert('Błąd', 'Hasło nie może być puste');
            return;
        }

        try {
            await changePassword(currentUser.id, newPassword);

            // Zaktualizuj dane zapisane lokalnie
            const updatedUser = { ...currentUser, password: newPassword };
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);

            Alert.alert('Sukces', 'Hasło zostało zmienione');
            setModalVisible(false);
            setNewPassword('');
        } catch (err) {
            console.log(err);
            Alert.alert('Błąd', 'Nie udało się zmienić hasła');
        }
    };

    // Wylogowanie
    const handleLogout = async () => {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('token');
        navigation.replace('Login');
    };

    // Usuwanie konta
    const handleDeleteAccount = async () => {
        Alert.alert(
            'Usuń konto',
            'Czy na pewno chcesz usunąć swoje konto? Tej operacji nie można cofnąć!',
            [
                { text: 'Nie', style: 'cancel' },
                {
                    text: 'Tak',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteAccount(currentUser.id);
                            await AsyncStorage.removeItem('user');
                            await AsyncStorage.removeItem('token');

                            Alert.alert('Sukces', 'Konto zostało usunięte');
                            navigation.replace('Login');
                        } catch (e) {
                            console.log(e);
                            Alert.alert('Błąd', 'Nie udało się usunąć konta');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Ustawienia</Text>

            {/* Zmiana hasła */}
            <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.accent }]}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.buttonText}>Zmień hasło</Text>
            </TouchableOpacity>

            {/* Zmiana motywu */}
            <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.accent }]}
                onPress={() => setShowPalette(!showPalette)}
            >
                <Text style={styles.buttonText}>Zmień motyw koloru</Text>
            </TouchableOpacity>

            {showPalette && (
                <View style={styles.palette}>
                    {Object.entries(themes).map(([key, t]) => (
                        <TouchableOpacity
                            key={key}
                            onPress={() => {
                                setTheme(t);
                                setShowPalette(false);
                            }}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 8,
                                backgroundColor: t.accent,
                                borderWidth: theme.name === t.name ? 3 : 1,
                                borderColor: theme.name === t.name ? theme.accent : '#ccc',
                                marginRight: 10,
                            }}
                        />
                    ))}
                </View>
            )}

            {/* Wylogowanie */}
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.accent }]} onPress={handleLogout}>
                <Text style={styles.buttonText}>Wyloguj</Text>
            </TouchableOpacity>

            {/* Usuwanie konta */}
            <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleDeleteAccount}>
                <Text style={styles.buttonText}>Usuń konto</Text>
            </TouchableOpacity>

            {/* Modal zmiany hasła */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ backgroundColor: theme.background, padding: 20, borderRadius: 10, width: 300 }}>
                        <Text style={{ color: theme.text, fontSize: 18, marginBottom: 10 }}>Nowe hasło</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Wpisz nowe hasło"
                            placeholderTextColor="#888"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                        />
                        <TouchableOpacity style={[styles.button, { backgroundColor: theme.accent }]} onPress={handleChangePassword}>
                            <Text style={styles.buttonText}>Zmień hasło</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { backgroundColor: 'red', marginTop: 10 }]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Anuluj</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    button: { padding: 10, borderRadius: 10, width: 200, marginBottom: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
    palette: { flexDirection: 'row', marginTop: 10, marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#888', borderRadius: 8, padding: 10, marginBottom: 15, width: '100%' },
});