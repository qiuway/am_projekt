import AsyncStorage from "@react-native-async-storage/async-storage";
import { Photo } from "../context/AppContext";
// Klucz pod którym zapiszemy dane w telefonie
const STORAGE_KEY = "MY_APP_DATA_V1";
type SavedData = {
 displayName: string;
 photos: Photo[];
};
export const saveAppData = async (data: SavedData) => {
 try {
 const jsonValue = JSON.stringify(data);
 await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
 } catch (e) {
 console.error("Nie udało się zapisać danych", e);
 }
 };
export const loadAppData = async (): Promise<SavedData | null> => {
 try {
 const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
 return jsonValue != null ? JSON.parse(jsonValue) : null;
 } catch (e) {
 console.error("Nie udało się wczytać danych", e);
 return null;
 }
};