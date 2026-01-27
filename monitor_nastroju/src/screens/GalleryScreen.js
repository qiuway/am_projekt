import React, { useContext, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, FlatList, TouchableOpacity, Modal} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../ThemeContext';
import { getEntries } from '../api/client';
import { Ionicons } from '@expo/vector-icons';

const numColumns = 3;
const spacing = 2;
const screenWidth = Dimensions.get('window').width;
const imageSize = (screenWidth - (spacing * (numColumns + 1))) / numColumns;

export default function GalleryScreen() {
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Stany dla modala podglądu
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const loadImages = async () => {
                setLoading(true);
                try {
                    const userString = await AsyncStorage.getItem('user');
                    if (!userString) return;
                    
                    const user = JSON.parse(userString);
                    const entries = await getEntries(user.id);
                    
                    const imageData = entries
                        .filter(e => e.imageUri)
                        .map(e => ({ 
                            uri: e.imageUri, 
                            id: e.id,
                            date: e.date,
                            emotion: e.emotion,
                            text: e.text
                        }));
                    
                    setImages(imageData);
                } catch (e) {
                    console.log('Błąd ładowania galerii:', e);
                } finally {
                    setLoading(false);
                }
            };
            loadImages();
        }, [])
    );

    const openImage = (item) => {
        setSelectedImage(item);
        setModalVisible(true);
    };

    const renderImage = ({ item }) => (
        <TouchableOpacity 
            style={styles.imageContainer}
            activeOpacity={0.8}
            onPress={() => openImage(item)}
        >
            <Image
                source={{ uri: item.uri }}
                style={styles.image}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={26} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Galeria</Text>
            </View>

            <FlatList
                data={images}
                renderItem={renderImage}
                keyExtractor={(item) => item.id.toString()}
                numColumns={numColumns}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={!loading && (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="images-outline" size={80} color={theme.accent} style={{ opacity: 0.3 }} />
                        <Text style={[styles.emptyText, { color: theme.text }]}>Brak zdjęć</Text>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
            />

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <TouchableOpacity 
                        style={styles.closeButton} 
                        onPress={() => setModalVisible(false)}
                    >
                        <Ionicons name="close-circle" size={40} color="#fff" />
                    </TouchableOpacity>

                    {selectedImage && (
                        <View style={styles.modalContent}>
                            <Image 
                                source={{ uri: selectedImage.uri }} 
                                style={styles.fullImage} 
                                resizeMode="contain" 
                            />
                            <View style={styles.imageInfo}>
                                <Text style={styles.infoDate}>
                                    {new Date(selectedImage.date).toLocaleDateString('pl-PL')} 
                                    {selectedImage.emotion ? ` • ${selectedImage.emotion.label}` : ''}
                                </Text>
                                <Text style={styles.infoText} numberOfLines={2}>
                                    {selectedImage.text}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    backButton: { marginRight: 15 },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    listContent: { paddingHorizontal: spacing / 2 },
    imageContainer: {
        margin: spacing / 2,
        borderRadius: 2,
        overflow: 'hidden',
    },
    image: { width: imageSize, height: imageSize },
    
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
    },
    modalContent: {
        width: '100%',
        height: '80%',
        justifyContent: 'center',
    },
    fullImage: {
        width: '100%',
        height: '100%',
    },
    imageInfo: {
        padding: 20,
        alignItems: 'center',
    },
    infoDate: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    infoText: {
        color: '#ccc',
        fontSize: 14,
        textAlign: 'center',
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        marginTop: 10,
        opacity: 0.5,
    }
});