import axios from 'axios';
import { API_BASE } from "./config";

export const login = async (username, password) => {
    const res = await axios.get(`${API_BASE}/users?username=${username}&password=${password}`);
    if (res.data.length === 0) throw new Error("Niepoprawne dane");
    const user = res.data[0];
    const token = 'fake-jwt-token';
    return { token, user };
};

export const register = async (username, password) => {
    // Sprawdzenie, czy użytkownik już istnieje
    const existing = await axios.get(`${API_BASE}/users?username=${username}`);
    if (existing.data.length > 0) throw new Error("Użytkownik już istnieje");

    // Dodanie nowego użytkownika
    const res = await axios.post(`${API_BASE}/users`, { username, password });
    return res.data;
};

export const changePassword = async (userId, newPassword) => {
    const res = await axios.patch(`${API_BASE}/users/${userId}`, { password: newPassword });
    return res.data;
};

export const deleteAccount = async (userId) => {
    const res = await axios.delete(`${API_BASE}/users/${userId}`);
    return res.data;
};

// Pobranie wpisów użytkownika
export const getEntries = async (userId) => {
  const res = await axios.get(`${API_BASE}/entries?userId=${userId}`);
  return res.data;
};

// Dodanie nowego wpisu
export const addEntry = async (entry) => {
  const res = await axios.post(`${API_BASE}/entries`, entry);
  return res.data;
};

// Edycja wpisu
export const updateEntry = async (id, updatedEntry) => {
  const res = await axios.put(`${API_BASE}/entries/${id}`, updatedEntry);
  return res.data;
};

// Usuwanie wpisu
export const deleteEntry = async (id) => {
  const res = await axios.delete(`${API_BASE}/entries/${id}`);
  return res.data;
};