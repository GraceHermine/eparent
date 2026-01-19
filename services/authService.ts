import api, { TOKEN_KEY, REFRESH_TOKEN_KEY } from './api';
import * as SecureStore from 'expo-secure-store';

export const authService = {
    // Connexion
    login: async (username: any, password: any) => {
        try {
            // Enlevez le /api/ si votre urls.py ne le contient pas
            const response = await api.post('/api/auth/jwt/create/', { 
                username,
                password,
            });

            const { access, refresh } = response.data;

            // Stockage sécurisé des tokens
            await SecureStore.setItemAsync(TOKEN_KEY, access);
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh);

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Déconnexion
    logout: async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    },

    // Récupérer l'utilisateur courant
    // authService.ts
    getMe: async () => {
        try {
            const response = await api.get('/api/auth/users/me/'); // Correction de l'URL
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Vérifier si connecté
    isAuthenticated: async () => {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        return !!token;
    }
};
