import api from './api';

export const messagingService = {
    // Liste des conversations
    getConversations: async () => {
        const response = await api.get('/api/messaging/conversations/');
        return response.data;
    },

    // Détails d'une conversation (avec messages)
    getConversationDetails: async (conversationId: any) => {
        // Backend endpoint modifie pour renvoyer la conversation ET les messages
        const response = await api.get(`/api/messaging/conversations/${conversationId}/messages/`);
        return response.data;
    },

    // Créer une conversation
    createConversation: async (data: any) => {
        const response = await api.post('/api/messaging/conversations/create/', data);
        return response.data;
    },

    // Envoyer un message
    sendMessage: async (conversationId: any, content: string) => {
        const response = await api.post(`/api/messaging/conversations/${conversationId}/messages/create/`, { content });
        return response.data;
    },

    // Récupérer la liste des contacts (Profs pour parents, etc.)
    getContacts: async () => {
        const response = await api.get('/api/messaging/contacts/');
        return response.data;
    }
};
