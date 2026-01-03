import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// URL de base de l'API (à adapter selon votre environnement)
// Pour Android Emulator: http://10.0.2.2:8000
// Pour iOS Simulator: http://localhost:8000
// Pour appareil physique: utilise l'IP de votre machine (ex: http://192.168.1.15:8000)
const BASE_URL = 'http://10.113.227.105:8000';
 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const TOKEN_KEY = 'user_token';
export const REFRESH_TOKEN_KEY = 'user_refresh_token';

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
