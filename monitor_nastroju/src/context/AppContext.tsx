import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { loadAppData, saveAppData } from "../utils/storage";
export type Photo = {
 id: string;
 uri: string;
 createdAt: number;
};
type AppState = {
 displayName: string;
 photos: Photo[];
 token: string | null;
};
type AppContextType = {
 state: AppState;
 setDisplayName: (name: string) => void;
 addPhoto: (photo: Photo) => void;
 removePhoto: (id: string) => void;
 login: (token: string) => Promise<void>;
 logout: () => Promise<void>;
};
const AppContext = createContext<AppContextType | null>(null);
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
 const [state, setState] = useState<AppState>({
 displayName: "",
 photos: [],
 token: null,
 });
 useEffect(() => {
 const initApp = async () => {
 try {

 const savedData = await loadAppData();

 const savedToken = await SecureStore.getItemAsync("auth_token");
 setState((prev) => ({
 ...prev,
 displayName: savedData?.displayName ?? "",
 photos: savedData?.photos ?? [],
 token: savedToken ?? null,
 }));
 } catch (error) {
 console.error("Błąd podczas wczytywania danych:", error);
 }
 };
 initApp();
 }, []);

 useEffect(() => {

 saveAppData({
 displayName: state.displayName,
 photos: state.photos,
 });
 }, [state.displayName, state.photos]);

 const setDisplayName = (name: string) =>
 setState((s) => ({ ...s, displayName: name }));
 const addPhoto = (photo: Photo) =>
 setState((s) => ({ ...s, photos: [photo, ...s.photos] }));
 const removePhoto = (id: string) =>
 setState((s) => ({ ...s, photos: s.photos.filter((p) => p.id !== id) }));
 const login = async (token: string) => {
 await SecureStore.setItemAsync("auth_token", token);
 setState((s) => ({ ...s, token }));
 };

 const logout = async () => {
 await SecureStore.deleteItemAsync("auth_token");
 setState((s) => ({ ...s, token: null }));
 };
 return (
 <AppContext.Provider
 value={{ state, setDisplayName, addPhoto, removePhoto, login, logout }}
 >
 {children}
 </AppContext.Provider>
 );
};
export const useAppContext = () => {
 const context = useContext(AppContext);
 if (!context) {
 throw new Error("useAppContext musi być użyte wewnątrz AppProvider");
 }
 return context;
};